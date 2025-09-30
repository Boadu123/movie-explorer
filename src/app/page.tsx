import Link from "next/link"

export default function Home(){
    return <div>
        <Link href ="/movies" className="p-4 m-6 rounded-md bg-blue-500 text-white">Enjoy some Movies</Link>
    </div>
}