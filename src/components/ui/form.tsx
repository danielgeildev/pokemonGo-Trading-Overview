"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Partner } from "@/lib/db";
import { addPartner, NewPartner } from "@/lib/db.items";
import { getPokemon, Pokemon } from "@/lib/pokemon";
import { usePokemon } from "@/hooks/usePokemon";

const formSchema = z.object({
  displayName: z.string().min(5, "Bug Name must be at least 5 characters."),
  pokemon: z.string(),
  pokemonSprite: z.string(),
  redditUrl: z.string(),
  inGameName: z.string(),
  friendCode: z.string(),
});

const DEFAULT_VALUES = {
      displayName: "",
      redditUrl: "",
      pokemon: "",
      pokemonSprite: "",
      inGameName: "",
      friendCode: "",
    }
type FormProps = {
  editData?: Partner | null;
  onEdit?: (id: string, updatedData: NewPartner) => void;
  onAddSuccess?: () => void;
}

export function Form({ editData, onEdit, onAddSuccess }: FormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const {pokemon, setPokemon} = usePokemon()


  React.useEffect(() => {
    if (editData) 
      {console.log(editData)
    form.reset(editData)}
  }, [editData])

  function onSubmit(data: z.infer<typeof formSchema>) {
    data.pokemonSprite = pokemon?.sprites?.front_default ?? ""
    console.log(data)
    addPartner(data);
    form.reset(DEFAULT_VALUES);
    onAddSuccess?.();
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Add new Person</CardTitle>
        <CardDescription>Du Nugget</CardDescription>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted ring-2 ring-border">
            {pokemon?.sprites?.front_default ? (
              <img
                src={pokemon.sprites?.front_default}
                alt=""
                className="h-full w-full object-contain"
              />
            ) : ( 
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="text-2xl" aria-hidden>⚡</span>
              </div>
            )}
          </div>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            
            <Controller
              name="displayName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Person Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="pokemon"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Pokemon
                  </FieldLabel>
                  <Input 
                    {...field}
                  onChange={async (e) => {field.onChange(e) 
                    getPokemon(e.target.value).then(setPokemon)
                  }}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="friendCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Friend Code
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="inGameName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    InGameName
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="redditUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Reddit Url
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset(DEFAULT_VALUES)}>
            Reset
          </Button>
          {editData ? <Button onClick={() => onEdit ? onEdit(editData.id, form.getValues()) : {}} >edit</Button> : <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>}
          
        </Field>
      </CardFooter>
    </Card>
  );
}
