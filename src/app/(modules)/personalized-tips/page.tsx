'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generatePersonalizedTips, type PersonalizedTipsOutput } from '@/ai/flows/generate-personalized-tips';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, AlertTriangle, CheckCircle, BrainCircuit, Sparkles, Loader2 } from 'lucide-react';
import { useAwareness } from '@/hooks/useAwareness';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TIPS_POINTS = 20;

const formSchema = z.object({
  role: z.enum(['worker', 'admin'], { required_error: 'Por favor selecciona un rol.' }),
  currentThreats: z.string().min(1, 'Por favor describe las amenazas actuales.').max(500, 'La descripción es demasiado larga.'),
});

export default function PersonalizedTipsPage() {
  const [tips, setTips] = useState<PersonalizedTipsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [tipsAcknowledged, setTipsAcknowledged] = useState(false);

  const { addScore } = useAwareness();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: undefined,
      currentThreats: 'Aumento reciente de ataques de phishing dirigidos a credenciales de empleados y amenazas de ransomware a servidores de la empresa.',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setTips(null);
    setTipsAcknowledged(false);

    startTransition(async () => {
      try {
        const result = await generatePersonalizedTips(values);
        setTips(result);
      } catch (e) {
        console.error(e);
        setError('Hubo un problema al comunicarse con la IA. Por favor, inténtalo de nuevo más tarde.');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Hubo un problema al comunicarse con la IA. Por favor, inténtalo de nuevo más tarde.',
        });
      }
    });
  }
  
  const handleAcknowledge = () => {
    addScore(TIPS_POINTS);
    setTipsAcknowledged(true);
    toast({
      title: '¡Puntuación Actualizada!',
      description: `Has ganado ${TIPS_POINTS} puntos por revisar tus consejos personalizados.`,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Consejos Personalizados de IA</h1>
        </div>
        <p className="text-muted-foreground">Obtén consejos de ciberseguridad adaptados a tu rol, impulsados por IA.</p>
      </header>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Genera Tus Consejos</CardTitle>
              <CardDescription>Selecciona tu rol y proporciona contexto sobre las amenazas de seguridad actuales para recibir consejos personalizados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tu Rol</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu rol en la empresa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="worker">Empleado</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentThreats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Panorama de Amenazas Actual (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ej: Aumento de correos de phishing, nueva variante de ransomware..."
                        className="resize-none"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generar Consejos
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isPending && (
        <Card className="mt-6">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 flex-1" />
            </div>
            <div className="flex items-start space-x-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <div className="flex items-start space-x-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {tips && (
        <Card className="mt-6 animate-in fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="text-primary" />
              Tus Consejos Personalizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {tips.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAcknowledge} disabled={tipsAcknowledged}>
              {tipsAcknowledged ? '¡Puntos Otorgados!' : `Entendido (+${TIPS_POINTS} Puntos)`}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
