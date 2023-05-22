import { ReactNode } from 'react'
import './globals.css'
import { Roboto_Flex as Roboto, Bai_Jamjuree as BaiJamjuree } from 'next/font/google'
import { EmptyMemories } from '@/components/EmptyMemories'
import { Hero } from '@/components/Hero'
import { Profile } from '@/components/Profile'
import { Signin } from '@/components/Signin'
import { Copyright } from '@/components/Copyright'
import { cookies } from 'next/headers'


const roboto = Roboto ({ subsets: ['latin'], variable: '--font-roboto' })
const baiJamjuree = BaiJamjuree ({ subsets: ['latin'], weight: '700', variable: '--font-bai-jam-juree' })

export const metadata = {
  title: 'NLW Spacetime',
  description: 'Uma cápsula do tempo construída com React, Next.js, TailwindCSS e Typescript',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = cookies().has('token')
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${baiJamjuree.variable} font-sans bg-gray-900 text-gray-100`}>
        <main className="grid min-h-screen grid-cols-2"> 
          <div className="relative flex flex-col items-start justify-between  bg-[url(../assets/bg-stars.svg)] bg-cover overflow-hidden px-28 py-16 border-r border-white/10">
            <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-700 opacity-50 blur-full"></div>
              <div className="absolute right-2 top-0 bottom-0 w-2  bg-stripes "></div>
                {isAuthenticated ? <Profile /> : <Signin />}
                <Hero />
                <Copyright />
          </div>
          <div className="flex flex-col p-16 bg-[url(../assets/bg-stars.svg)] bg-cover">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
