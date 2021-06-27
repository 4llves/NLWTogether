import { Link, useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from  '../assets/images/check.svg'
import answerImg from  '../assets/images/answer.svg'

import { Button } from '../components/Button/index'
import { RoomCode } from '../components/RoomCode/index'
import { Question } from '../components/Question/index'

import '../styles/room.scss'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'


type RoomParams = {
  id: string
}

export function AdminRoom() {
  // const { user } = useAuth()
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id

  const { questions, title } = useRoom(roomId)

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update	({
      endedAt: new Date()
    })

    history.push('/')
  }

  async function handleDeleteQuetion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true, 
    })
  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true,      
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="letmeask" height={45}/>
          </Link>
          <div>
            <RoomCode code={roomId}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar Aula</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighLighted={question.isHighLighted}
              >
                { !question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHighLightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="dar destaque à pergunta" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteQuetion(question.id)}
                >
                  <img src={deleteImg} alt="remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}