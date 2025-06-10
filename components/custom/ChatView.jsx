"use client"
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { api } from '@/convex/_generated/api';
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import Colors from '@/data/Colors';
import Image from 'next/image';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react'
import Lookup from '@/data/Lookup'
import Prompt from '@/data/Prompt';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'
import { useSidebar } from '../ui/sidebar';
import { toast } from 'sonner';

export const countToken = (inputText) => {
    return inputText.trim().split(/\s+/).filter(word => word).length;
};

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const { messages, setMessages } = useContext(MessagesContext);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState(false);
    const UpdateMessages = useMutation(api.workspace.UpdateMessages);
    const { toggleSidebar } = useSidebar();
    const UpdateTokens = useMutation(api.users.UpdateToken);

    useEffect(() => {
        id && GetWorkspaceData();
    }, [id])

    const GetWorkspaceData = async () => {

        //Used to get Workspace data using workspace ID
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });
        setMessages(result?.messages)
        console.log(result);

    }
    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role == 'user') {
                GetAiResponse()
            }
        }
    }, [messages])

    const GetAiResponse = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
        const result = await axios.post('/api/ai-chat', {
            prompt: PROMPT
        });
        // console.log(result.data.result);
        const aiResp = {
            role: 'ai',
            content: result.data.result
        }
        setMessages(prev => [...prev, aiResp])


        await UpdateMessages({
            messages: [...messages, aiResp],
            workspaceId: id
        })


        // console.log("LEN", countToken(JSON.stringify(aiResp)));


        const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));

        setUserDetail(prev=>({
            ...prev,
            token:token
        }))

        //Update Tokens in datbase

        await UpdateTokens({
            userId: userDetail?._id,
            token: token
        })
        setLoading(false);
    }

    const onGenerate = (input) => {
        if (userDetail?.token < 10) {
            toast('You dont have enough tokens..')
            return;
        }
        setMessages(prev => [...prev, {
            role: 'user',
            content: input
        }])
        setUserInput('')
    }

    return (
        <div className='relative h-[85vh] flex flex-col'>
            <div className='flex-1 overflow-y-scroll scrollbar-hide pl-5'
                style={{
                    scrollbarWidth: 'none',      // Firefox
                    msOverflowStyle: 'none'      // IE and Edge
                }}>
                {messages?.map((msg, index) => (
                    <div
                        key={index}
                        className='p-3 rounded-lg mb-2 flex gap-2 items-start leading-7'
                        style={{
                            backgroundColor: Colors.CHAT_BACKGROUND
                        }}
                    >
                        {msg?.role === 'user' && (
                            <Image
                                src={userDetail?.picture}
                                alt='userImage'
                                width={35}
                                height={35}
                                className='rounded-full'
                            />
                        )}
                        <div className="flex flex-col">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && <div className='p-3 rounded-lg mb-2 flex gap-2 items-start'
                    style={{
                        backgroundColor: Colors.CHAT_BACKGROUND
                    }}
                >
                    <Loader2Icon className='animate-spin' />
                    <h2>Generating Response...</h2>
                </div>
                }
            </div>


            {/* Input Section */}
            <div className='flex gap-2 items-end'>
                {userDetail && <Image
                    className='rounded-full cursor-pointer'
                    onClick={toggleSidebar}
                    src={userDetail?.picture} alt='user' width={30} height={30} />}

                <div className='p-5 border rounded-xl max-w-xl w-full mt-3 '
                    style={{ backgroundColor: Colors.BACKGROUND }}>
                    <div className='flex gap-2'>
                        <textarea placeholder={Lookup.INPUT_PLACEHOLDER}
                            value={userInput}
                            onChange={(event) => setUserInput(event.target.value)}
                            className='outline-none bg-transparent w-full h-32 max-h-56 resize-none' />
                        {userInput && <ArrowRight
                            onClick={() => onGenerate(userInput)}
                            className='bg-blue-500 p-2 h-10 w-8 rounded-md cursor-pointer'></ArrowRight>}
                    </div>
                    <div>
                        <Link className='h-5 w-5' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatView