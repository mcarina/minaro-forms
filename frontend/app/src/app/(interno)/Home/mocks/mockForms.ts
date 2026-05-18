export interface FormItem {
  id: string
  title: string
  description: string
  responses: number
  lastEdited: string
  isFavorite: boolean
}

export const mockForms: FormItem[] = [
  {
    id: "1",
    title: "Pesquisa de Satisfação",
    description: "Avalie nossos serviços e produtos",
    responses: 127,
    lastEdited: "Há 2 horas",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Formulário de Inscrição",
    description: "Evento de tecnologia 2024",
    responses: 89,
    lastEdited: "Ontem",
    isFavorite: false,
  },
  {
    id: "3",
    title: "Feedback do Produto",
    description: "Conte-nos sua experiência",
    responses: 45,
    lastEdited: "Há 3 dias",
    isFavorite: true,
  },
  {
    id: "4",
    title: "Pesquisa de Mercado",
    description: "Análise de preferências do consumidor",
    responses: 234,
    lastEdited: "Há 1 semana",
    isFavorite: false,
  },
  {
    id: "5",
    title: "Avaliação de Treinamento",
    description: "Como foi sua experiência no curso?",
    responses: 56,
    lastEdited: "Há 2 semanas",
    isFavorite: false,
  },
]
