"use client"

import { useState } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function RevisionH5PPage() {
  const searchParams = useSearchParams()
  const contentType = searchParams.get("type") || "flashcard"

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [crosswordAnswers, setCrosswordAnswers] = useState<Record<string, string>>({})
  const [timelineExpanded, setTimelineExpanded] = useState<number | null>(null)

  const flashcards = [
    {
      question: "Qu'est-ce qu'une métaphore ?",
      answer:
        "Une figure de style qui établit une comparaison implicite entre deux éléments sans utiliser d'outil de comparaison.",
      example: "Exemple : 'La vie est un long fleuve tranquille'",
    },
    {
      question: "Qu'est-ce qu'une comparaison ?",
      answer:
        "Une figure de style qui rapproche deux éléments à l'aide d'un outil de comparaison (comme, tel que, semblable à...).",
      example: "Exemple : 'Il est fort comme un lion'",
    },
    {
      question: "Qu'est-ce qu'une hyperbole ?",
      answer: "Une figure de style qui consiste à exagérer une idée pour la mettre en relief.",
      example: "Exemple : 'Je meurs de faim'",
    },
    {
      question: "Qu'est-ce qu'une personnification ?",
      answer:
        "Une figure de style qui attribue des caractéristiques humaines à un objet, un animal ou une idée abstraite.",
      example: "Exemple : 'Le vent hurle dans la nuit'",
    },
  ]

  const timelineEvents = [
    {
      year: "1789",
      title: "Prise de la Bastille",
      description:
        "Le 14 juillet 1789, le peuple parisien prend d'assaut la forteresse de la Bastille, symbole de l'absolutisme royal.",
      details: "Cet événement marque le début de la Révolution française et devient la fête nationale française.",
    },
    {
      year: "1791",
      title: "Constitution de 1791",
      description: "Première constitution écrite de France, établissant une monarchie constitutionnelle.",
      details: "Elle limite les pouvoirs du roi et instaure la séparation des pouvoirs.",
    },
    {
      year: "1792",
      title: "Proclamation de la République",
      description: "Le 22 septembre 1792, la Convention proclame la République et abolit la monarchie.",
      details: "C'est le début de la Première République française.",
    },
    {
      year: "1793",
      title: "Exécution de Louis XVI",
      description: "Le roi Louis XVI est guillotiné le 21 janvier 1793 pour trahison.",
      details: "Cet événement choque l'Europe et déclenche la formation de coalitions contre la France.",
    },
    {
      year: "1794",
      title: "Chute de Robespierre",
      description:
        "Le 27 juillet 1794 (9 thermidor an II), Robespierre est arrêté et exécuté, mettant fin à la Terreur.",
      details: "Cette période marque la fin de la phase la plus radicale de la Révolution.",
    },
  ]

  const crosswordClues = {
    horizontal: [
      { number: 1, clue: "Ensemble des nombres réels (8 lettres)", answer: "FONCTION", row: 0, col: 0 },
      {
        number: 3,
        clue: "Point où la courbe coupe l'axe des ordonnées (8 lettres)",
        answer: "ORDONNEE",
        row: 2,
        col: 1,
      },
      { number: 5, clue: "Valeur maximale d'une fonction (7 lettres)", answer: "MAXIMUM", row: 4, col: 0 },
    ],
    vertical: [
      { number: 2, clue: "Représentation graphique d'une fonction (6 lettres)", answer: "COURBE", row: 0, col: 2 },
      { number: 4, clue: "Ensemble de départ d'une fonction (7 lettres)", answer: "DOMAINE", row: 1, col: 5 },
    ],
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setCrosswordAnswers({})
    setTimelineExpanded(null)
  }

  const renderContent = () => {
    switch (contentType) {
      case "flashcard":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2rem] shadow-xl p-8 min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Les figures de style</h2>
                <span className="text-slate-500 font-medium">
                  {currentIndex + 1} / {flashcards.length}
                </span>
              </div>

              <div
                className="flex-1 flex items-center justify-center cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="w-full">
                  {!isFlipped ? (
                    <div className="text-center">
                      <div className="text-6xl mb-6">❓</div>
                      <p className="text-2xl font-bold text-slate-900 mb-4">{flashcards[currentIndex].question}</p>
                      <p className="text-slate-500 text-sm">Cliquez pour voir la réponse</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-6">💡</div>
                      <p className="text-xl font-bold text-slate-900 mb-4">{flashcards[currentIndex].answer}</p>
                      <p className="text-slate-600 italic">{flashcards[currentIndex].example}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Précédent
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Recommencer
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === flashcards.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
                >
                  Suivant
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )

      case "timeline":
        return (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-[2rem] shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Chronologie de la Révolution française</h2>

              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500" />

                <div className="space-y-8">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="relative pl-20">
                      <div className="absolute left-4 w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>

                      <div
                        className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setTimelineExpanded(timelineExpanded === index ? null : index)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-2xl font-bold text-blue-600">{event.year}</span>
                          <ChevronRight
                            className={`w-6 h-6 text-slate-400 transition-transform ${
                              timelineExpanded === index ? "rotate-90" : ""
                            }`}
                          />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                        <p className="text-slate-600">{event.description}</p>
                        {timelineExpanded === index && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <p className="text-slate-700">{event.details}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case "crossword":
        return (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-[2rem] shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Mots croisés - Vocabulaire des fonctions</h2>

              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Horizontal</h3>
                  <div className="space-y-3">
                    {crosswordClues.horizontal.map((clue) => (
                      <div key={clue.number} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold">
                            {clue.number}
                          </span>
                          <p className="text-slate-700 flex-1">{clue.clue}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-4 mt-6">Vertical</h3>
                  <div className="space-y-3">
                    {crosswordClues.vertical.map((clue) => (
                      <div key={clue.number} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center font-bold">
                            {clue.number}
                          </span>
                          <p className="text-slate-700 flex-1">{clue.clue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-8 aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🔤</div>
                      <p className="text-slate-600 font-medium">Grille de mots croisés interactive</p>
                      <p className="text-slate-500 text-sm mt-2">Utilisez les indices pour remplir la grille</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2rem] shadow-xl p-8 text-center">
              <p className="text-slate-600">Type de contenu non reconnu</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-8">
      <header className="sticky top-0 z-50 bg-white px-3 sm:px-6 py-3 sm:py-4 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/fiches">
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
          </Link>
          <img src="/images/dinobot-logo.png" alt="Dinobot" className="w-10 h-10 object-contain" />
          <h1 className="text-xl font-bold text-slate-900">Révision H5P</h1>
        </div>
      </header>

      <main className="px-3 sm:px-6 mt-6">{renderContent()}</main>
    </div>
  )
}
