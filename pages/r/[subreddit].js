import { getPostsFromSubreddit, getSubreddit } from "@/lib/data";
import prisma from "@/lib/prisma";
import Posts from "../components/Posts";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Subreddit({ subreddit, posts }) {
    if (!subreddit) {
        return <p className='text-center p-5'>Subreddit does not exist 😞</p>
    }

    const router = useRouter()
    const { data: session, status } = useSession()

    const loading = status === 'loading'

    if (loading) return null


    return (
        <>
            <header className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
                <Link href={`/`} className='underline'>
                    Home
                </Link>
                <p className='grow'></p>
            </header>
            <header className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
                <p className='text-center'>/r/{subreddit.name}</p>
                <p className='ml-4 text-left grow'>{subreddit.description}</p>
            </header>
            {session && (
                <div className="border border-3 border-black p-10 mx-20 my-10">
                    <input placeholder="Create Post"
                        className="border-gray-700 border-2 p-4 w-full"
                        onClick={() => {
                            router.push(`/r/${subreddit.name}/submit`)
                        }} />
                </div>
            )}
            <Posts posts={posts} />
        </>
    )
}

export async function getServerSideProps({ params }) {
    const subreddit = await getSubreddit(params.subreddit, prisma)
    let posts = await getPostsFromSubreddit(params.subreddit, prisma)

    posts = JSON.parse(JSON.stringify(posts))

    return {
        props: {
            subreddit,
            posts,
        }
    }
}