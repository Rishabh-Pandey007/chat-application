import { compare } from "bcrypt";
import {User} from "../models/user.js";
import { emitEvent, sendToken } from "../utils/features.js";
import { fa, fr, ne } from "@faker-js/faker";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions } from "../utils/features.js";
import { newGroupChat } from "./chat.js";
import { Chat } from '../models/chats.js';
import {Request} from "../models/request.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import e from "express";
import { getOtherMember } from "../lib/helper.js";

//Create a new user and save it to the database and save in cookie
const newUser= async(req, res, next)=>{

    const {name, username, password, bio}= req.body;

    const avatar = {
        public_id:"sdfsd",
        url:"asdf",
    };

    // fetch if user already exists
    const userExist = await User.findOne({username});

    if(userExist)
    return res.status(400).json({error:"User already exists"});
    

    const user = await User.create(
        {
            name,
            bio, 
            username, 
            password,
            avatar,
        });
    
      
       sendToken(res, user, 201, "User created");
        
};

// Login user and save token in cookie
const login= TryCatch(async(req, res, next)=>{

    const {username, password}= req.body;

    const user = await User.findOne({username}).select("+password");

    if(!user)  return next(new ErrorHandler("Invalid Username or Password", 404)); 
    
    const isMatch = await compare(password, user.password);

    if(!isMatch) return next(new ErrorHandler("Invalid Username or Password", 404));

    sendToken(res, user, 200, `Welcome back, ${user.name}`);
});

const getMyProfile = TryCatch(async(req, res ,next) => {

    const user = await User.findById(req.user);

    if(!user) return next(new ErrorHandler("User not found", 404));
    res.status(200).json({
        success: true,
        user,
    });
});


const logout = TryCatch(async(req, res) => {

    return res.status(200).cookie("chattu-token", "", {...cookieOptions, maxAge: 0}).json({
        success: true,
        message: "Logged Out Successfully",
    });
});


const searchUser = TryCatch(async(req, res) => {

    const {name = "" } = req.query; 

    // Find all my chats
    const myChats = await Chat.find({groupChat: false, members: req.user  });
    
    // All Users from my chats means friends
    const allUsersFromMyChats = myChats.flatMap((chat)=>chat.members);

    // Find All Users except me and friends
      const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersFromMyChats },
        name: { $regex: name, $options: "i" },
      });

     // Modify th respone
    const users = allUsersExceptMeAndFriends.map(({_id, name, avatar})=>({
        _id,
        name,
        avatar: avatar.url, 
    }));  

    return res.status(200).json({
        success: true,
        users,
    });
});


const sendFriendRequest = TryCatch(async(req, res, next) => {

    const {userId} = req.body;

    const request = await Request.findOne({
        $or: [
            {sender: req.user, receiver: userId},
            {sender: userId, receiver: req.user}, 
        ],
    });

    if(request)  return next(new ErrorHandler("Already sent a friend request", 400));

    await Request.create({
        sender: req.user,
        receiver: userId,
    });

    emitEvent(req,NEW_REQUEST, [userId]);
    
    return res.status(200).json({
        success: true,
        message: "Friend request sent ",
    });
});
 

const acceptFriendRequest = TryCatch(async(req, res, next) => {

    const { requestId, accept} = req.body;

    const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

    if(!request) return next(new ErrorHandler("Request not found", 404));

    if(request.receiver._id.toString() !== req.user.toString()) 
        return next(new ErrorHandler("You are not authorised to accept this request", 403));

    if(!accept) {

        await request.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Friend Request Rejected",
        })
    }

    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
        Chat.create({ 
            members, 
            name: `${request.sender.name} - ${request.receiver.name}`,
        }),
        request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
        success: true,
        message: "Friend Request Accepted",
        senderId: request.sender._id,
    });
});


const getMyNotifications = TryCatch(async(req, res,) => {
    const requests = await Request.find({
        receiver: req.user,
    }).populate("sender", "name avatar"); 

    const allRequests = requests.map(({_id, sender})=>({
        _id,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url,
        },
    }))
    return res.status(200).json({
        success: true,
        allRequests,
    });
});



const getMyFriends = TryCatch(async(req, res,) => {

    const chatId = req.query.chatId;

    const chat = await Chat.findById({
        members: req.user,
        groupChat: false,
    }).populate("members", "name avatar");

    const friends = chat.members.map(({members})=>{
        
        const otherUser = getOtherMember(members, req.user);

        return {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar.url,
        }
    });

    if(chatId) {

         const chat = await Chat.findById(chatId);

         const availableFriends = friends.filter(
             (friend)=> !chat.members.includes(friend._id)
         ); 
         
             return res.status(200).json({
                success: true,
                friends: availableFriends,
            });
         
    } else {
        
        return res.status(200).json({
            success: true,
            friends,
        });
    }
   
});


export {
    login, 
    newUser, 
    getMyProfile, 
    logout, 
    searchUser, 
    sendFriendRequest, 
    acceptFriendRequest, 
    getMyNotifications,
    getMyFriends,
};