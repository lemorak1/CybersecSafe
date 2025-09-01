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
import { CheckCircle, XCircle, ArrowRight, RotateCw, Users } from 'lucide-react';

const socialEngineeringQuestions: Question[] = [
  {
    id: 1,
    questionText: "Recibes una llamada de alguien que dice ser del departamento de TI de tu empresa. Dicen que necesitan tu contraseña para realizar una actualización de seguridad urgente en tu computadora. ¿Qué deberías hacer?",
    options: [
      "Darles tu contraseña, ya que son de TI.",
      "Pedir su nombre y colgar, luego llamar al departamento de TI a su número de teléfono oficial para verificar.",
      "Pedirles que demuestren que son de TI diciéndote tu ID de empleado.",
      "Colgar inmediatamente e ignorarlo."
    ],
    correctAnswerIndex: 1,
    explanation: "Esta es la acción más segura. Los estafadores pueden falsificar fácilmente su identidad. Al llamar al número oficial de TI, te aseguras de hablar con un empleado legítimo. Nunca des tu contraseña por teléfono.",
    points: 15,
  },
  {
    id: 2,
    questionText: "Encuentras una unidad USB etiquetada como 'Salarios de Empleados' en el estacionamiento de la oficina. ¿Cuál es el curso de acción más seguro?",
    options: [
      "Conectarla a tu computadora para ver a quién pertenece.",
      "Ignorarla y dejarla en el suelo.",
      "Conectarla a una computadora aislada y sin conexión a la red.",
      "Entregarla a tu departamento de TI u oficina de seguridad sin conectarla."
    ],
    correctAnswerIndex: 3,
    explanation: "Este es un ataque de cebo común. La unidad USB podría contener malware que infecte tu computadora al conectarla. El departamento de TI tiene procedimientos para manejar dichos dispositivos de forma segura.",
    points: 10,
  },
  {
    id: 3,
    questionText: "Una persona con uniforme de repartidor intenta entrar a tu edificio de oficinas pero su tarjeta de acceso no funciona. Te pide que le sostengas la puerta. Esto se conoce como...",
    options: [
      "Piggybacking o Tailgating",
      "Baiting (Cebo)",
      "Quid Pro Quo",
      "Ser un colega servicial"
    ],
    correctAnswerIndex: 0,
    explanation: "Este es un ejemplo clásico de 'tailgating', una táctica de ingeniería social física para obtener acceso no autorizado. No debes dejarle entrar y, en su lugar, dirigirlo a la recepción o seguridad para obtener el acceso adecuado.",
    points: 10,
  }
];

export default function SocialEngineeringPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { addScore } = useAwareness();

  const currentQuestion = socialEngineeringQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;

  const handleNext = () => {
    if (showResult) {
      setShowResult(false);
      setSelectedAnswer(null);
      if (currentQuestionIndex < socialEngineeringQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentQuestionIndex(socialEngineeringQuestions.length);
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
  
  const progress = useMemo(() => (currentQuestionIndex / socialEngineeringQuestions.length) * 100, [currentQuestionIndex]);

  if (currentQuestionIndex >= socialEngineeringQuestions.length) {
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
            <p>Has terminado el módulo de ingeniería social. ¡Cada vez es más difícil engañarte!</p>
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
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Escenarios de Ingeniería Social</h1>
        </div>
        <p className="text-muted-foreground">Lee el escenario y elige el mejor curso de acción.</p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Escenario {currentQuestion.id} de {socialEngineeringQuestions.length}</CardTitle>
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
