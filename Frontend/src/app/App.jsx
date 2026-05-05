import { useRef, useMemo, useState, useEffect } from 'react'
import './App.css'
import { Editor } from '@monaco-editor/react'
import { MonacoBinding } from 'y-monaco'
import * as Y from 'yjs'
import { SocketIOProvider } from 'y-socket.io'

function App() {
  const editorRef = useRef(null);
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || ""
  });
  const [users, setUsers] = useState([]);

  const ydoc = useMemo(() => new Y.Doc(), []) // multiple changes store in ydoc and compare with current changes.
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc])

  const handleMount = (editor) => {
    editorRef.current = editor;
    new MonacoBinding( // what Monaco Binding do : it make connection with user editor and Yjs
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current])
    )
  }

  const handleJoin = (e) => {
    e.preventDefault();
    setUsername(e.target.username.value)
    window.history.pushState({},"","?username=" + e.target.username.value)
  }

  useEffect(() => {

    console.log();
    if (username) {
      const provider = new SocketIOProvider("/", "monaco", ydoc, {
        autoConnect: true,
      })

      provider.awareness.setLocalStateField("user", { username })

       const states = Array.from(provider.awareness.getStates().values())
       console.log(states)

       setUsers(states.filter(state => state.user && state.user.username).map(state => state.user))

      // User changes state defined
      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values())
        console.log(states)
        setUsers(states.filter(state => state.user && state.user.username).map(state => state.user))
      });

      // beforeUnload means when we refresh page so before refresh page we process the below changes.
      function handleBeforeUnload() {
        provider.awareness.setLocalStateField("user", null)
      }
      // before page refresh called
      window.addEventListener("beforeunload", handleBeforeUnload)

      return () => {
        provider.disconnect()
        window.removeEventListener("beforeunload", handleBeforeUnload)
      }
    }
  }, [
    username
  ])

  if(!username) {
    return (
      <main className='h-screen w-full bg-gray-950 flex gap-4 p-4 items-center justify-center'>
        <form className="flex flex-col gap-4"
              onSubmit={handleJoin}>
          <input 
             type="text"
             placeholder='Enter your username'
             className='p-2 rounded-lg bg-gray-800 text-white'
             name='username'
           />
           <button
              className='p-2 rounded-lg bg-amber-50 text-gray-950 font-bold'
            >
            Join
           </button>
        </form>   
      </main>
    )
  }

  return (
    <>
    <main className='h-screen w-full bg-gray-950 flex gap-4 p-4'>
      <aside className='w-1/4 bg-amber-50 rounded-lg'>
        <h2 className='text-2xl font-bold p-4 border-b border-gray-300'>Users</h2>
        <ul className='p-4'>
          { users.map((user, index) => (
            <li key={index} className='p-2 bg-gray-800 text-white rounded mb-2'>
              {user.username}
            </li>
          ))}
        </ul>
      </aside>
      <section className='w-3/4 bg-neutral-800 rounded-lg overflow-hidden'>
        <Editor height='100%'
                defaultLanguage='Javascript'
                defaultValue='// Some comment'
                theme='vs-dark'
                onMount={handleMount}
        />
      </section>
    </main>
    </>
  )
}

export default App
