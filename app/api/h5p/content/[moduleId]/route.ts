// app/api/h5p/content/[id]/route.ts
import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

interface H5PContent {
  title?: string;
  questions?: { question: string; choices?: string[] }[];
  [key: string]: any;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const contentPath = path.join(
    process.cwd(),
    'public',
    'h5p-modules',
    id,
    'content',
    'content', // Le dossier interne créé par l’extraction du H5P
    'content.json'
  );

  try {
    const contentFile = await readFile(contentPath, 'utf-8');
    const content: H5PContent = JSON.parse(contentFile);

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (err: any) {
    console.error(`❌ Erreur lecture content.json pour le module ${id}:`, err);
    return NextResponse.json(
      {
        success: false,
        error: 'Fichier content.json introuvable ou illisible après extraction.',
      },
      { status: 404 }
    );
  }
}
