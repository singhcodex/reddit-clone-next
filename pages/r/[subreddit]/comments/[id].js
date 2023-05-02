import { getPost, getSubreddit, getVote, getVotes } from "@/lib/data";
import prisma from "@/lib/prisma";
import Link from "next/link";
import timeago from "@/lib/timeago";
import NewComment from "@/pages/components/NewComment";
import { useSession } from "next-auth/react";
import Comments from "@/pages/components/Comments";
import { useRouter } from "next/router";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";


/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Post({ subreddit, post, vote, votes }) {
  
  const router = useRouter()
  const { data: session, status } = useSession()

  const loading = status === 'loading'

  if (loading) {
    return null
  }

  if (!post) return <p className='text-center p-5'>Post does not exist 😞</p>


  const sendVote = async (up) => {
    await fetch('/api/vote', {
      body: JSON.stringify({
        post: post.id,
        up,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    })

    router.reload(window.location.pathname)
  }

  return (
    <>
      <header className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
        <Link href={`/`} className='underline'>
          Home
        </Link>
        <p className='grow'></p>
      </header>
      <header className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
        <Link href={`/r/${subreddit.name}`} className='text-center underline'>
          /r/{subreddit.name}
        </Link>
        <p className='ml-4 text-left grow'>{subreddit.description}</p>
      </header>
      <div className="flex flex-row mb-4 px-10 justify-center">
        <div className="flex flex-col mb-4 border-t border-l border-b border-3 border-black p-10 bg-gray-200 my-10 text-center">
          <div
            className='cursor-pointer'
            onClick={async (e) => {
              e.preventDefault()
              sendVote(true)
            }}
          >
            {vote?.up ? '⬆' : '↑'}
          </div>
          <div> { votes }</div>
          <div
            className='cursor-pointer'
            onClick={async (e) => {
              e.preventDefault()
              sendVote(false)
            }}
          >
            {!vote ? '↓' : vote?.up ? '↓' : '⬇'}
          </div>
        </div>
        <div className='flex flex-col mb-4 border border-3 border-black p-10 bg-gray-200 mx-20 my-10'>
          <div className='flex flex-shrink-0 pb-0 '>
            <div className='flex-shrink-0 block group '>
              <div className='flex items-center text-gray-800'>
                Posted by {post.author.username}{' '}
                <p className='mx-2 underline'>
                  {timeago.format(new Date(post.createdAt))}
                </p>
              </div>
            </div>
          </div>
          <div className='mt-1'>
            <a className='flex-shrink text-2xl font-bold color-primary width-auto'>
              {post.title}
            </a>
            <p className='flex-shrink text-base font-normal color-primary width-auto mt-2'>
              {post.content}
            </p>
          </div>
          {session ? (
            <>
              <NewComment post={post} />

            </>

          ) : (
            <p className="mt-5">
              <a className="mr-1 underline" href="/api/auth/signin">Login</a> to Add a Commemt
            </p>
          )}

          <Comments comments={post.comments} post={post}/>
        </div>

      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  const subreddit = await getSubreddit(context.params.subreddit, prisma)
  let post = await getPost(parseInt(context.params.id), prisma)
  post = JSON.parse(JSON.stringify(post))

  let votes  = await getVotes(parseInt(context.params.id), prisma)

  votes = JSON.parse(JSON.stringify(votes))

  let vote = await getVote(parseInt(context.params.id), session?.user.id, prisma)

  vote  = JSON.parse(JSON.stringify(vote))

  return {
    props: {
      subreddit,
      post,
      votes,
      vote
    },
  }
}