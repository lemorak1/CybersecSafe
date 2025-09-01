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
import { CheckCircle, XCircle, ArrowRight, RotateCw, KeyRound } from 'lucide-react';

const passwordQuestions: Question[] = [
  {
    id: 1,
    questionText: "¿Cuál de las siguientes es la contraseña más segura?",
    options: ["password123", "MiPerroFido", "R#4!b*2^pL@9q$zV", "11111111"],
    correctAnswerIndex: 2,
    explanation: "Una contraseña segura es larga (12+ caracteres) e incluye una mezcla de mayúsculas, minúsculas, números y símbolos. 'R#4!b*2^pL@9q$zV' es el mejor ejemplo.",
    points: 10,
  },
  {
    id: 2,
    questionText: "¿Cuál es la mejor práctica para gestionar contraseñas en diferentes sitios web?",
    options: [
      "Usar la misma contraseña segura en todas partes",
      "Usar una contraseña única para cada cuenta",
      "Escribirlas en una nota adhesiva",
      "Cambiar ligeramente tu contraseña principal para cada sitio (ej., ContraseñaFB, ContraseñaGoogle)"
    ],
    correctAnswerIndex: 1,
    explanation: "Usar una contraseña única para cada cuenta es crucial. Si un sitio es vulnerado, tus otras cuentas permanecen seguras. Los gestores de contraseñas son una gran herramienta para esto.",
    points: 15,
  },
  {
    id: 3,
    questionText: "¿Qué hace la 'Autenticación de Dos Factores' (2FA)?",
    options: [
        "Hace que tu contraseña sea el doble de larga",
        "Requiere dos contraseñas separadas para iniciar sesión",
        "Añade una segunda capa de seguridad, como un código de tu teléfono",
        "Es un tipo de software antivirus"
    ],
    correctAnswerIndex: 2,
    explanation: "La 2FA añade un segundo paso de verificación para iniciar sesión, normalmente un código temporal enviado a otro dispositivo que posees, como tu teléfono. Esto significa que incluso si alguien roba tu contraseña, no puede acceder a tu cuenta.",
    points: 10,
  }
];

export default function PasswordSecurityPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { addScore } = useAwareness();

  const currentQuestion = passwordQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;

  const handleNext = () => {
    if (showResult) {
      setShowResult(false);
      setSelectedAnswer(null);
      if (currentQuestionIndex < passwordQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentQuestionIndex(passwordQuestions.length);
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
  
  const progress = useMemo(() => (currentQuestionIndex / passwordQuestions.length) * 100, [currentQuestionIndex]);

  if (currentQuestionIndex >= passwordQuestions.length) {
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
            <p>Has completado el módulo de seguridad de contraseñas. ¡Buen trabajo!</p>
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
            <KeyRound className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Seguridad de Contraseñas</h1>
        </div>
        <p className="text-muted-foreground">Pon a prueba tus conocimientos sobre las mejores prácticas de contraseñas.</p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Pregunta {currentQuestion.id} de {passwordQuestions.length}</CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium mb-6">{currentQuestion.questionText}</p>
          
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(Number(value))}
            disabled={showResult}
            className="gap-4"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base flex-1">{option}</Label>
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
