// app/api/h5p/upload/route.ts

import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import AdmZip from 'adm-zip';

// Obligatoire en Next.js 13+ pour pouvoir lire formData()
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('h5p') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convertir File → Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // GENERER UN ID UNIQUE
    const moduleId = `module-${Date.now()}`;

    // public/h5p-modules/module-xxxxxx
    const modulePath = path.join(process.cwd(), 'public', 'h5p-modules', moduleId);
    await mkdir(modulePath, { recursive: true });

    // Sauvegarder le fichier brut .h5p
    await writeFile(path.join(modulePath, 'content.h5p'), buffer);

    // Extraire zip
    const zip = new AdmZip(buffer);

    // Lire métadonnées du fichier h5p.json
    let metadata: any = { title: "Module H5P" };

    try {
      const h5pEntry = zip.getEntry('h5p.json');
      if (h5pEntry) {
        metadata = JSON.parse(h5pEntry.getData().toString('utf8'));
      }
    } catch (e) {
      console.log("⚠️ Impossible de lire h5p.json");
    }

    // Sauvegarder metadata.json
    await writeFile(
      path.join(modulePath, 'metadata.json'),
      JSON.stringify(
        {
          moduleId,
          metadata,
          uploadDate: new Date().toISOString()
        },
        null,
        2
      )
    );

    console.log(`✅ Module sauvegardé: ${moduleId}`);

    return NextResponse.json({
      success: true,
      moduleId,
      metadata: {
        title: metadata.title || "Module H5P"
      },
      uploadDate: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("❌ Erreur upload:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
