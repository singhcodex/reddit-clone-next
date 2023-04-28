import { getSubreddit } from "@/lib/data";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";
import { useState } from "react";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function NewPost({ subreddit})
{
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    if(!subreddit) {
        return <p className="p-5 text-center">Subreddit does on exits 😞 </p>
    }

    return [
        <>
        <header className='flex h-12 px-5 pt-3 pb-2 text-white bg-black'>
          <Link href={`/`} className='underline'>
            Home
          </Link>
          <p className='grow'></p>
        </header>
        <header className='flex h-12 px-5 pt-3 pb-2 text-white bg-black'>
          <Link href={`/r/${subreddit.name}`} className='text-center underline'>
            /r/{subreddit.name}
          </Link>
          <p className='ml-4 text-left grow'>{subreddit.description}</p>
        </header>

        <div className='flex flex-row justify-center px-10 mb-4'>
            <div className="flex flex-col p-10 my-10 mb-4 bg-gray-200 border border-black border-3">
                <form className="flex flex-col">
                    <h2 className="mb-8 text-2xl font-bold">Create a Post</h2>
                    <input className="w-full p-4 text-ls font-medium bg-transparent border border-black border-gray-700"
                    placeholder="The Post title"
                    onChange={(e) => setTitle(e.target.value)}/>
                    <textarea className="w-full p-4 text-lg font-medium bg-transparent border border-gray-700" />
                </form>
            </div>
        </div>

        </>
    ]
}


export async function getServerSideProps({params}){
    const subreddit = await getSubreddit(params.subreddit, prisma)


    return  {
        props: {
            subreddit
        }
    }
}