import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fish, KeyRound, Users, BrainCircuit, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

function WelcomeDisplay() {
  return (
    <Card className="col-span-1 md:col-span-2 bg-primary text-primary-foreground shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <ShieldCheck className="w-8 h-8" />
          Tu Viaje de CiberSeguridad
        </CardTitle>
        <CardDescription className="text-primary-foreground/80 pt-2">
          Completa los módulos a continuación para poner a prueba tus conocimientos y mejorar tu conciencia sobre ciberseguridad. Tu progreso se registrará a medida que avanzas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Comienza con cualquier módulo para empezar a construir tu puntuación de conciencia.</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const modules = [
    {
      title: "Simulación de Phishing",
      description: "Aprende a detectar y evitar intentos de phishing engañosos en tu bandeja de entrada.",
      href: "/phishing-simulation",
      icon: <Fish className="w-8 h-8 text-primary" />,
    },
    {
      title: "Seguridad de Contraseñas",
      description: "Domina el arte de crear contraseñas fuertes y únicas para tus cuentas.",
      href: "/password-security",
      icon: <KeyRound className="w-8 h-8 text-primary" />,
    },
    {
      title: "Ingeniería Social",
      description: "Reconoce y defiéndete de las tácticas de manipulación psicológica.",
      href: "/social-engineering",
      icon: <Users className="w-8 h-8 text-primary" />,
    },
    {
      title: "Consejos Personalizados de IA",
      description: "Obtén consejos de ciberseguridad impulsados por IA y adaptados a tu rol específico.",
      href: "/personalized-tips",
      icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-headline">
            Bienvenido al <span className="text-primary">Laboratorio CyberSafe</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Un campo de entrenamiento interactivo para agudizar tus defensas contra las amenazas cibernéticas modernas.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <WelcomeDisplay />

          {modules.map((module) => (
            <Card key={module.href} className="flex flex-col hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  {module.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="font-headline">{module.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{module.description}</p>
              </CardContent>
              <CardContent>
                <Button asChild className="w-full font-semibold" variant="outline">
                  <Link href={module.href}>
                    Iniciar Módulo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
