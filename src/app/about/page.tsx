import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Weblog',
  description: 'Learn more about me and this blog. I\'m a passionate developer who loves sharing knowledge about web development, technology, and more.',
  keywords: ['about', 'developer', 'web development', 'technology', 'blog'],
  author: 'Admin',
  creator: 'Admin',
  robots: 'index, follow',
  openGraph: {
    title: 'About | Weblog',
    description: 'Learn more about me and this blog. I\'m a passionate developer who loves sharing knowledge about web development, technology, and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Weblog',
    description: 'Learn more about me and this blog. I\'m a passionate developer who loves sharing knowledge about web development, technology, and more.',
  },
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
          <p className="text-xl text-muted-foreground">
            Welcome to my corner of the internet! Here's a bit about who I am and what this blog is all about.
          </p>
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>Who Am I?</h2>
          <p>
            I'm a passionate developer with a love for creating beautiful, functional web applications. 
            My journey in technology started years ago, and I've been fascinated by the rapid evolution 
            of web development ever since.
          </p>

          <h2>What I Do</h2>
          <p>
            I specialize in modern web development technologies, with a particular focus on:
          </p>
          <ul>
            <li><strong>Frontend Development</strong>: React, Next.js, TypeScript, and modern CSS frameworks</li>
            <li><strong>Backend Development</strong>: Node.js, Python, and various databases</li>
            <li><strong>Cloud Technologies</strong>: AWS, Docker, and serverless architectures</li>
            <li><strong>Developer Tools</strong>: Building tools that make developers' lives easier</li>
          </ul>

          <h2>Why This Blog?</h2>
          <p>
            This blog serves multiple purposes:
          </p>
          <ul>
            <li><strong>Sharing Knowledge</strong>: I believe in giving back to the developer community that has taught me so much</li>
            <li><strong>Learning in Public</strong>: Writing about what I learn helps solidify my understanding</li>
            <li><strong>Building Connections</strong>: Connecting with like-minded developers and tech enthusiasts</li>
            <li><strong>Documenting Journey</strong>: Keeping track of my growth and experiences in tech</li>
          </ul>

          <h2>What You'll Find Here</h2>
          <p>
            On this blog, I write about:
          </p>
          <ul>
            <li>Web development tutorials and best practices</li>
            <li>Technology reviews and comparisons</li>
            <li>Personal projects and case studies</li>
            <li>Industry trends and insights</li>
            <li>Career advice and lessons learned</li>
          </ul>

          <h2>My Tech Stack</h2>
          <p>
            This blog itself is built with some of my favorite technologies:
          </p>
          <ul>
            <li><strong>Next.js 15</strong> - The React framework for production with App Router</li>
            <li><strong>TypeScript</strong> - For type safety and better developer experience</li>
            <li><strong>Tailwind CSS</strong> - For utility-first styling and responsive design</li>
            <li><strong>MDX</strong> - For writing content with React components</li>
            <li><strong>React Markdown</strong> - For rendering markdown content</li>
          </ul>

          <h2>Let's Connect!</h2>
          <p>
            I love connecting with fellow developers and tech enthusiasts. Feel free to reach out if you:
          </p>
          <ul>
            <li>Have questions about any of my blog posts</li>
            <li>Want to collaborate on a project</li>
            <li>Have suggestions for topics you'd like me to cover</li>
            <li>Just want to say hi and share your own experiences</li>
          </ul>
          
          <p>
            You can find me on various platforms:
          </p>
          <ul>
            <li><strong>GitHub</strong>: Check out my open source projects and contributions</li>
            <li><strong>Twitter</strong>: Follow me for quick updates and tech discussions</li>
            <li><strong>Email</strong>: Feel free to drop me a line directly</li>
          </ul>

          <h2>Fun Facts</h2>
          <p>
            When I'm not coding, you might find me:
          </p>
          <ul>
            <li>Reading about the latest tech trends and innovations</li>
            <li>Experimenting with new programming languages and frameworks</li>
            <li>Contributing to open source projects</li>
            <li>Mentoring aspiring developers</li>
            <li>Exploring the great outdoors (balance is important!)</li>
          </ul>

          <div className="mt-12 p-6 bg-secondary rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Thanks for Visiting!</h3>
            <p className="mb-0">
              I'm glad you're here! Whether you're a seasoned developer, just starting your journey, 
              or simply curious about technology, I hope you find something valuable in my posts. 
              Don't hesitate to reach out – I'd love to hear from you!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}