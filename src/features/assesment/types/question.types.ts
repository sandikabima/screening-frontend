export interface OptionEntity {
  id: string;
  questionId: string;
  optionLabel: string;
  score: number;
  orderNumber: number;
}

export interface Question {
  id: string;
  code: string;
  category: "SRQ" | "INTI";
  questionText: string;
  orderNumber: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  options: OptionEntity[];
}

export interface UpdateQuestionTextPayload {
  questionText: string;
}
