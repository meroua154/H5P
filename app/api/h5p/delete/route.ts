// app/api/h5p/delete/route.ts

import { NextResponse } from 'next/server';
import { del, list } from '@vercel/blob';

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    console.log('🗑️ DELETE Request pour:', moduleId);

    if (!moduleId || moduleId.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'ID du module manquant' },
        { status: 400 }
      );
    }

    // Lister tous les fichiers du module
    const { blobs } = await list({
      prefix: `h5p-modules/${moduleId}/`,
    });

    if (blobs.length === 0) {
      return NextResponse.json(
        { success: false, error: `Module ${moduleId} introuvable` },
        { status: 404 }
      );
    }

    // Supprimer tous les fichiers du module
    const urls = blobs.map(blob => blob.url);
    await del(urls);

    console.log(`✅ Module supprimé de Blob: ${moduleId}`);

    return NextResponse.json({
      success: true,
      message: `Module ${moduleId} supprimé avec succès`,
      moduleId: moduleId,
      deletedFiles: urls.length
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (err: any) {
    console.error('❌ Erreur suppression:', err);
    
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Erreur lors de la suppression',
        details: err.stack
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}