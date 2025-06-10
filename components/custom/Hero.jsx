"use client"
import React, { useState } from 'react'
import { useContext } from 'react'
import { MessagesContext } from '@/context/MessagesContext'

import Image from 'next/image'
import Lookup from '@/data/Lookup'
import { ArrowRight, Link } from 'lucide-react'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext'
import SignInDialog from './SignInDialog'
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation'


function Hero() {
  const [userInput, setUserInput] = useState();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkSpace = useMutation(api.workspace.CreateWorkSpace);
  const router = useRouter();

  const onGenerate = async (input) => {

    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
    
    if (userDetail?.token < 10) {
      toast('You dont have enough tokens..')
      return;
    }
    const msg = {
      role: 'user',
      content: input
    };

    setMessages(msg);

    const workspaceId = await CreateWorkSpace({
      user: userDetail._id,
      messages: [msg]
    });

    console.log(workspaceId);
    router.push('/workspace/' + workspaceId);

  }

  return (
    <div className='flex flex-col items-center mt-36 xl:mt-52 gap-2'>
      <h2 className='font-bold text-4xl'>{Lookup.HERO_HEADING}</h2>
      <p className='text-gray-400 font-medium'>{Lookup.HERO_DESC}</p>
      <div className='p-5 border rounded-xl max-w-xl w-full mt-3 '
        style={{ backgroundColor: Colors.BACKGROUND }}>
        <div className='flex gap-2'>
          <textarea placeholder={Lookup.INPUT_PLACEHOLDER}
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


      <div className='flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3' >
        {Lookup?.SUGGSTIONS.map((suggestion, index) => (
          <h2
            onClick={() => onGenerate(suggestion)}
            key={index}
            className='p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer'
          >{suggestion}</h2>
        ))}
      </div>
      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)} />
    </div>
  )
}

export default Hero