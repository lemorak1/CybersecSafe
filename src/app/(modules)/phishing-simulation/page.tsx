'use client';

import { useState, useMemo } from 'react';
import type { Question } from '@/lib/types';
import { useAwareness } from '@/hooks/useAwareness';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, ArrowRight, RotateCw, Fish } from 'lucide-react';

const PhishingQuestion1 = () => (
    <div className="border rounded-lg p-4 bg-secondary/30">
        <p className="text-sm text-muted-foreground">De: Bank of America &lt;secure.update@boaf.com&gt;</p>
        <p className="text-sm text-muted-foreground">Asunto: Urgente: ¡Su cuenta ha sido suspendida!</p>
        <hr className="my-2" />
        <p>Estimado Cliente,</p>
        <p>Detectamos actividad inusual en su cuenta. Por su seguridad, hemos suspendido su cuenta. Por favor, haga clic en el siguiente enlace para verificar su identidad.</p>
        <p className="mt-2"><a href="#" onClick={(e) => e.preventDefault()} className="text-blue-500 underline">http://boaf-security-update.com/login</a></p>
        <p className="mt-2">Gracias, <br />Equipo de Seguridad de Bank of America</p>
    </div>
);

const PhishingQuestion2 = () => (
    <div className="border rounded-lg p-4 bg-secondary/30">
        <p className="text-sm text-muted-foreground">De: Soporte de TI &lt;it.support@yourcompany.com&gt;</p>
        <p className="text-sm text-muted-foreground">Asunto: Mantenimiento del Sistema</p>
        <hr className="my-2" />
        <p>Hola equipo,</p>
        <p>Realizaremos mantenimiento del sistema esta noche a las 10 PM. No se requiere ninguna acción de su parte. Esto es solo una notificación.</p>
        <p className="mt-2">Gracias, <br/>Departamento de TI</p>
    </div>
);

const PhishingQuestion3 = () => (
     <div className="border rounded-lg p-4 bg-secondary/30">
      <p className="text-sm text-muted-foreground">De: Dropbox &lt;no-reply@dropbox-support.net&gt;</p>
      <p className="text-sm text-muted-foreground">Asunto: Se ha compartido un nuevo archivo con usted</p>
      <hr className="my-2" />
      <p>Se ha compartido con usted un nuevo archivo titulado 'Finanzas-Q4.zip'. Haga clic a continuación para ver el archivo.</p>
      <div className="text-center my-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded">Ver Archivo</button>
      </div>
      <p>Este archivo estará disponible durante 24 horas.</p>
    </div>
);

const phishingQuestions: Question[] = [
  {
    id: 1,
    questionText: <PhishingQuestion1 />,
    options: ["Correo Legítimo", "Intento de Phishing"],
    correctAnswerIndex: 1,
    explanation: "Esto es un intento de phishing. Observe que el dominio del correo del remitente 'boaf.com' no es el oficial 'bankofamerica.com'. El tono urgente y un enlace sospechoso también son señales de alerta importantes.",
    points: 10,
  },
  {
    id: 2,
    questionText: <PhishingQuestion2 />,
    options: ["Correo Legítimo", "Intento de Phishing"],
    correctAnswerIndex: 0,
    explanation: "Este parece ser un correo legítimo. La dirección del remitente usa el dominio de la empresa, no hay una llamada a la acción urgente y no solicita credenciales ni que haga clic en un enlace sospechoso.",
    points: 10,
  },
  {
    id: 3,
    questionText: <PhishingQuestion3 />,
    options: ["Correo Legítimo", "Intento de Phishing"],
    correctAnswerIndex: 1,
    explanation: "Esto es probablemente phishing. El dominio del remitente 'dropbox-support.net' es sospechoso. Los archivos compartidos inesperados, especialmente con nombres genéricos como 'Finanzas', deben tratarse con extrema precaución.",
    points: 15,
  }
];

export default function PhishingSimulationPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { addScore } = useAwareness();

  const currentQuestion = phishingQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;

  const handleNext = () => {
    if (showResult) {
      setShowResult(false);
      setSelectedAnswer(null);
      if (currentQuestionIndex < phishingQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // End of quiz
        setCurrentQuestionIndex(phishingQuestions.length);
      }
    } else if (selectedAnswer !== null) {
      if (isCorrect) {
        addScore(currentQuestion.points);
      }
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };
  
  const progress = useMemo(() => (currentQuestionIndex / phishingQuestions.length) * 100, [currentQuestionIndex]);


  if (currentQuestionIndex >= phishingQuestions.length) {
    return (
      <div className="text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 font-headline">
                <CheckCircle className="w-8 h-8 text-green-500" />
                ¡Módulo Completado!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Has completado la simulación de phishing. Revisa tu puntuación de conciencia actualizada en el encabezado.</p>
            <Button onClick={restartQuiz} className="mt-4">
              <RotateCw className="mr-2 h-4 w-4" />
              Intentar de Nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
            <Fish className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Simulación de Phishing</h1>
        </div>
        <p className="text-muted-foreground">Analiza el correo electrónico a continuación y determina si es un intento de phishing.</p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Escenario {currentQuestion.id} de {phishingQuestions.length}</CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="mb-6">{currentQuestion.questionText}</div>
          
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(Number(value))}
            disabled={showResult}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base">{option}</Label>
              </div>
            ))}
          </RadioGroup>

          {showResult && (
            <Alert variant={isCorrect ? 'default' : 'destructive'} className="mt-6 animate-in fade-in">
              {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{isCorrect ? '¡Correcto!' : 'Incorrecto'}</AlertTitle>
              <AlertDescription>
                {currentQuestion.explanation}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <div className="p-6 pt-0">
          <Button onClick={handleNext} disabled={selectedAnswer === null} className="w-full">
            {showResult ? 'Siguiente' : 'Verificar Respuesta'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
