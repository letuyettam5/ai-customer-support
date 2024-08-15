'use client'
import Image from "next/image";
import { useState } from "react";
import * as React from 'react';
import {Box, Stack, TextField, Button, Typography } from "@mui/material";
import { signOut } from "next-auth/react";

export default function Home() {

  const [messages, setMessages] = useState([
    {role: 'assistant',
    content: 'Hello, how are you doing today?'} 
  ]);

  const [message, setMessage] = useState("");
  const sendMessage = async() => {
    setMessage('');  // Clear the input
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' }
    ]);
  
  const response = fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([...messages,{role: 'user', content: message}])
  }).then(async(res)=>{
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let result = ''
    return reader.read().then(function processText({done, value}){
      if (done) {
        return result
      }
      const text = decoder.decode(value || new IntBArray(), {stream: true});
      setMessages((messages)=>{
        let lastMessage = messages[messages.length - 1]
        let otherMessages = messages.slice(0, messages.length-1);
        return([
          ...otherMessages,
          {
            ...lastMessage,
            content: lastMessage.content + text
          }
        ])
      }
      
    )
    return reader.read().then(processText);
    })
  })
};

  const handleLogout = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    await signOut({ redirect: true, callbackUrl: baseUrl });
  };
  return (
    <Box 
    className="bg-[url('/background.svg')]"
    height={'100vh'}
    display={'flex'} flexDirection={'column'} 
    justifyContent={'center'} alignItems={'center'}
    >
      <Typography 
      variant="h3"
      marginTop={'1%'}
      color={'white'}
      >Your AI friend</Typography>
      <Stack
      className="rounded-lg shadow-2xl bg-white"
      direction={'column'}
      width="40%"
      height="500px"
      marginTop={'1%'}
      p={2}
      spacing={2}>
        <Stack 
        direction={'column'}
        spacing={2}
        flexGrow={1}
        overflow={'auto'}
        maxHeight={'100%'}>
          {messages.map((message, index)=>(
            <Box 
            
            key={index} display={'flex'} justifyContent={
            message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
              <Box
                bgcolor={message.role === 'assistant' ? '#009dee' : '#d49dff'}
                color={'white'}
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack
        direction={'row'}
        spacing={2}
      >
        <TextField
          label="Message"
          fullWidth
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
        />
        <Button variant="contained" onClick={sendMessage}>Send</Button>
      </Stack>
      
      </Stack>
      <button type="button" className="text-white bg-blue-700
       hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
       font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
        dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none
         dark:focus:ring-blue-800 mt-2
         shadow-lg shadow-blue-500/50" 
         onClick={handleLogout}
         >LOG OUT</button>
    </Box>
  );
}