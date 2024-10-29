import express from "express"
import { isAuthenticated } from "../middlewares/auth.js";
import { 
    addMembers, 
    deleteChat, 
    getChatDetails, 
    getMessages, 
    getMyChats, 
    getMyGroups, 
    leaveGroup, 
    newGroupChat, 
    removeMember, 
    renameGroup, 
    sendAttachments 
} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import { addMemberValidator, chatDIdValidator, newGroupValidator, removeMemberValidator, renameValidator, sendAttachmentsValidator, validateHandler } from "../lib/validators.js";

const app =express.Router();

// After here user must be Logged in to access the routes

app.use(isAuthenticated);

app.post("/new", newGroupValidator(), validateHandler, newGroupChat);

app.get("/my",  getMyChats);

app.get("/my/groups",  getMyGroups);

app.put("/addmembers", addMemberValidator(), validateHandler,  addMembers);

app.put("/removemember", removeMemberValidator(), validateHandler, removeMember);

app.delete("/leave/:id" , chatDIdValidator(), validateHandler, leaveGroup);

// send attachments
app.post("/message", attachmentsMulter, sendAttachmentsValidator(), validateHandler, sendAttachments);

// Get messages
app.get("/message/:id/", chatDIdValidator(), validateHandler, getMessages);
// app.put("/chat/:id/",B);
// app.delete("/chat/:id/",C);

//Get chat details, rename and delete
app
.route("/:id")
.get(chatDIdValidator(), validateHandler, getChatDetails)
.put(renameValidator(), validateHandler, renameGroup)
.delete(chatDIdValidator(), validateHandler, deleteChat);


export default app;
 