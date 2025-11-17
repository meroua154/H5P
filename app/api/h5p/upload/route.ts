// app/api/h5p/upload/route.ts

import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import AdmZip from 'adm-zip';

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
    
    // Générer ID unique
    const moduleId = `module-${Date.now()}`;

    // 1. Upload du fichier .h5p original vers Vercel Blob
    const h5pBlob = await put(`h5p-modules/${moduleId}/content.h5p`, buffer, {
      access: 'public',
      addRandomSuffix: false,
    });

    // 2. Extraire et lire métadonnées
    const zip = new AdmZip(buffer);
    let metadata: any = { title: "Module H5P" };

    try {
      const h5pEntry = zip.getEntry('h5p.json');
      if (h5pEntry) {
        metadata = JSON.parse(h5pEntry.getData().toString('utf8'));
      }
    } catch (e) {
      console.log("⚠️ Impossible de lire h5p.json");
    }

    // 3. Upload metadata.json vers Vercel Blob
    const metadataContent = JSON.stringify({
      moduleId,
      metadata,
      uploadDate: new Date().toISOString(),
      h5pUrl: h5pBlob.url
    }, null, 2);

    await put(`h5p-modules/${moduleId}/metadata.json`, metadataContent, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });

    // 4. Upload des fichiers extraits (h5p.json, content.json, etc.)
    const entries = zip.getEntries();
    
    for (const entry of entries) {
      if (entry.isDirectory) continue;
      
      const filePath = `h5p-modules/${moduleId}/content/${entry.entryName}`;
      const fileData = entry.getData();
      
      await put(filePath, fileData, {
        access: 'public',
        addRandomSuffix: false,
      });
    }

    console.log(`✅ Module uploadé vers Blob: ${moduleId}`);

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