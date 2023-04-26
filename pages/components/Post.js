import timeago from "@/lib/timeago"
import Link from "next/link"

export default function Post({post}){
    return (
        <div className='flex flex-col p-10 mx-20 my-10 mb-4 bg-gray-200 border border-3 border-black'>
      <div className='flex flex-shrink-0 pb-0'>
        <div className='flex-shrink-0 block group'>
        <div className='flex items-center text-gray-800'>
        <Link href={`/r/${post.subredditName}`} className='mr-2 underline'>
							/r/{post.subredditName}
            </Link> Posted By {post.author.username}{' '}
            <Link href={`/r/${post.subredditName}/comments/${post.id}`} className='mx-2 underline'>
              {timeago.format(new Date(post.createdAt))}
            </Link>
        </div>
        </div>
        
      </div>

      <div className='mt-5'>
      <Link href={`/r/${post.subredditName}/comments/${post.id}`} className='flex-shrink text-2xl font-bold color-primary width-auto'>
          {post.title}
        </Link>
        <p className='flex-shrink text-base font-normal color-primary width-auto mt-2'>{ post.content }</p>
      </div>
    </div>
    )
}