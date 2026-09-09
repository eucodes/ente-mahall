import { FindMahallForm } from "./find-mahall-form";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Ente Mahall</h1>
      <p className="max-w-md text-muted-foreground">
        Digital management platform for Mahalls — membership, contributions, and communication in one place.
      </p>
      <FindMahallForm />
    </main>
  );
}
