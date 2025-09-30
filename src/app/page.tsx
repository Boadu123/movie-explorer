import Link from "next/link"

export default function Home(){
    return <div className="flex">
        <Link href ="/movies" className="p-3 m-9 rounded-md bg-blue-500 text-white">Movies</Link>
    </div>
}