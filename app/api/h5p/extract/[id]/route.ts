// app/api/h5p/extract/[id]/route.ts


import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir, access } from 'fs/promises';
import path from 'path';
import AdmZip from 'adm-zip';

export const dynamic = "force-dynamic";

const VIEWER_TEMPLATE_PATH = path.join(process.cwd(), 'viewer.html');

interface RouteContext {
  params: Promise<{ id: string }>; // Next.js 15+ requires Promise
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    
    console.log('📦 Extraction demandée pour le module:', id);
    
    const modulePath = path.join(process.cwd(), 'public', 'h5p-modules', id);
    const extractPath = path.join(modulePath, 'content');
    const h5pFile = path.join(modulePath, 'content.h5p');
    const viewerPath = path.join(modulePath, 'viewer.html');
    const contentJsonPath = path.join(extractPath, 'content', 'content.json');

    // Vérifier template viewer
    try {
      await access(VIEWER_TEMPLATE_PATH);
      console.log('✅ Template viewer.html trouvé');
    } catch {
      console.error('❌ Template viewer.html introuvable à:', VIEWER_TEMPLATE_PATH);
      return NextResponse.json(
        { 
          success: false,
          error: 'Template viewer.html introuvable',
          path: VIEWER_TEMPLATE_PATH
        },
        { status: 500 }
      );
    }

    // Vérifier fichier H5P
    try {
      await access(h5pFile);
      console.log('✅ Fichier H5P trouvé');
    } catch {
      console.error('❌ Fichier H5P introuvable à:', h5pFile);
      return NextResponse.json(
        { 
          success: false,
          error: 'Fichier H5P introuvable', 
          path: h5pFile 
        },
        { status: 404 }
      );
    }

    // Vérifier si déjà extrait
    let alreadyExtracted = false;
    try {
      await access(contentJsonPath);
      await access(viewerPath);
      alreadyExtracted = true;
      console.log('✅ Module déjà extrait');
    } catch {
      console.log('⚠️ Module non extrait, extraction en cours...');
    }

    if (alreadyExtracted) {
      return NextResponse.json({ 
        success: true, 
        alreadyExtracted: true 
      });
    }

    // Extraction H5P
    await mkdir(extractPath, { recursive: true });
    const buffer = await readFile(h5pFile);

    try {
      const zip = new AdmZip(buffer);
      zip.extractAllTo(extractPath, true);
      console.log('✅ Extraction ZIP réussie');
    } catch (err: any) {
      console.error('❌ Erreur extraction ZIP:', err);
      return NextResponse.json(
        { 
          success: false,
          error: 'Erreur lors de l\'extraction du fichier H5P',
          details: err.message
        },
        { status: 500 }
      );
    }

    // Vérifier content.json après extraction
    try {
      await access(contentJsonPath);
      console.log('✅ content.json trouvé après extraction');
    } catch {
      console.error('❌ content.json introuvable après extraction');
      return NextResponse.json(
        { 
          success: false,
          error: 'content.json introuvable après extraction',
          path: contentJsonPath
        },
        { status: 500 }
      );
    }

    // Créer viewer.html
    const templateContent = await readFile(VIEWER_TEMPLATE_PATH, 'utf-8');
    const viewerHtml = templateContent.replace(/\$\{id\}/g, id);
    await writeFile(viewerPath, viewerHtml);
    console.log('✅ viewer.html créé');

    return NextResponse.json({ 
      success: true, 
      extracted: true 
    });

  } catch (error: any) {
    console.error('❌ Erreur extraction:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message, 
        type: error.constructor.name,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}