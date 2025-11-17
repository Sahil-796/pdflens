import Image from "next/image"
import { Github, Twitter } from "lucide-react"

export default function TeamSection() {
  const members = [
    {
      name: "Rudra",
      image: "/rudra.jpg",
      github: "https://github.com/vyeos",
      x: "https://x.com/RudraPatel5435",
    },
    {
      name: "Sahil",
      image: "/sahil.jpeg",
      github: "https://github.com/Sahil-796",
      x: "https://x.com/SahilPa82684047",
    },
  ]

  return (
    <section className="mx-auto max-w-4xl px-6">
      <h2 className="text-center text-primary text-3xl font-semibold mb-10">
        Our Devs
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {members.map((member) => (
          <div
            key={member.name}
            className="flex flex-col items-center text-center"
          >
            {/* Avatar */}
            <div className="h-20 w-20 rounded-xl overflow-hidden shadow-md">
              <Image
                src={member.image}
                alt={member.name}
                width={100}
                height={100}
                className="rounded-xl object-cover"
              />
            </div>

            {/* Name */}
            <span className="mt-3 text-lg font-medium">{member.name}</span>

            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              <a
                href={member.github}
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <Github className="size-5" />
              </a>

              <a
                href={member.x}
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <Twitter className="size-5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
