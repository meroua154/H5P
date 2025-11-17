"use client"

import { useState } from "react"
import { ChevronDown, X, Check, Sparkles, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function H5PContentTypesPage() {
  const router = useRouter()
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState("Mathématiques")

  const subjects = [
    { name: "Mathématiques", icon: "📐", color: "text-[#6B8EFF]", bgColor: "bg-[#E8F0FF]" },
    { name: "Physique-Chimie", icon: "⚗️", color: "text-[#9B7FFF]", bgColor: "bg-[#F0E8FF]" },
    { name: "SVT", icon: "🌿", color: "text-[#5FBF8F]", bgColor: "bg-[#E8F8F0]" },
    { name: "Français", icon: "📚", color: "text-[#FF7F7F]", bgColor: "bg-[#FFE8E8]" },
  ]

  const contentTypes = [
    {
      id: "quiz",
      title: "Quiz",
      subtitle: "Quiz (Question Set)",
      icon: "📝",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "flashcards",
      title: "Cartes mémoires",
      subtitle: "Flashcards",
      icon: "🗂️",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "crosswords",
      title: "Mots croisés",
      subtitle: "Crosswords",
      icon: "🔤",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "timeline",
      title: "Frise chronologique",
      subtitle: "Timeline",
      icon: "📊",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: "page",
      title: "Page",
      subtitle: "",
      icon: "📄",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "drag-words",
      title: "Glisser les mots",
      subtitle: "Drag the Words",
      icon: "📋",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "fill-blanks",
      title: "Texte à trous",
      subtitle: "Fill in the Blanks",
      icon: "📝",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      id: "mark-words",
      title: "Surligner les mots",
      subtitle: "Mark the Words",
      icon: "✏️",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "essay",
      title: "Rédaction",
      subtitle: "Essay",
      icon: "📝",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "accordion",
      title: "Glossaire",
      subtitle: "Accordion",
      icon: "📚",
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      id: "test",
      title: "Test",
      subtitle: "",
      icon: "✅",
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      id: "qcm",
      title: "QCM",
      subtitle: "",
      icon: "📋",
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      id: "matching",
      title: "Appariement",
      subtitle: "",
      icon: "🔗",
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      id: "millionaire",
      title: "Millionnaire",
      subtitle: "",
      icon: "💰",
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      id: "glossary-xml",
      title: "Glossaire (XML)",
      subtitle: "",
      icon: "📖",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "chart",
      title: "Diagramme",
      subtitle: "Chart",
      icon: "📊",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: "summary",
      title: "Résumé",
      subtitle: "Summary",
      icon: "📄",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "multiple-choice",
      title: "Choix multiples",
      subtitle: "Multiple Choice",
      icon: "☑️",
      bgColor: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      id: "single-choice",
      title: "Série de choix uniques",
      subtitle: "Single Choice Set",
      icon: "🔘",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      id: "true-false",
      title: "Vrai/Faux",
      subtitle: "True/False Question",
      icon: "✓✗",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "dialog-cards",
      title: "Cartes de dialogue",
      subtitle: "Dialog Cards",
      icon: "💬",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: "sort-paragraphs",
      title: "Ordonner les paragraphes",
      subtitle: "Sort the Paragraphs",
      icon: "📑",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "find-words",
      title: "Mots mêlés",
      subtitle: "Find the Words",
      icon: "🔍",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ]

  const handleContentTypeClick = (typeId: string) => {
    router.push("/fiches/creer-fiche")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0FF] via-[#FAF5FF] to-[#FFF8FF]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
          <Link href="/fiches/creer-fiche">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          </Link>

          <Link href="/">
            <img
              src="/images/dinobot-logo.png"
              alt="DinoBot"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>

          <button
            onClick={() => setIsSubjectModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#C8D8FF] to-[#D8E4FF] text-[#4B6FFF] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 min-w-0"
          >
            <span className="truncate">{selectedSubject}</span>
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 px-2">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 animate-pulse" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">Types de contenu H5P</h2>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 animate-pulse" />
            </div>
            <p className="text-sm sm:text-base text-slate-600">
              Choisissez le type de contenu interactif que vous souhaitez créer
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 px-2">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleContentTypeClick(type.id)}
                className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl ${type.bgColor} flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm`}
                >
                  <span className="text-2xl sm:text-3xl">{type.icon}</span>
                </div>

                <div className="text-center space-y-0.5 sm:space-y-1">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight">{type.title}</span>
                  {type.subtitle && (
                    <span className="text-[10px] sm:text-xs text-slate-500 block leading-tight">{type.subtitle}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {isSubjectModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex md:items-center md:justify-center items-end"
          onClick={() => setIsSubjectModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-[2rem] md:rounded-[2rem] w-full md:max-w-md p-8 animate-slide-up max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Choisis ta matière</h3>
              <button
                onClick={() => setIsSubjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 -mr-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              {subjects.map((subject) => (
                <button
                  key={subject.name}
                  onClick={() => {
                    setSelectedSubject(subject.name)
                    setIsSubjectModalOpen(false)
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    selectedSubject === subject.name ? subject.bgColor + " shadow-md" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                      selectedSubject === subject.name ? "bg-white/60" : "bg-white"
                    }`}
                  >
                    {subject.icon}
                  </div>
                  <span className={`font-bold text-lg flex-1 text-left ${subject.color}`}>{subject.name}</span>
                  {selectedSubject === subject.name && <Check className={`w-6 h-6 flex-shrink-0 ${subject.color}`} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
