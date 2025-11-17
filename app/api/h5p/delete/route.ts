// app/api/h5p/delete/route.ts

import { NextResponse } from 'next/server';
import { rm, access } from 'fs/promises';
import path from 'path';

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  try {
    // Récupérer le moduleId depuis l'URL
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    console.log('🗑️ DELETE Request reçue');
    console.log('📋 URL complète:', request.url);
    console.log('🆔 Module ID extrait:', moduleId);

    if (!moduleId || moduleId.trim() === '') {
      console.error('❌ ID manquant ou invalide');
      return NextResponse.json(
        { success: false, error: 'ID du module manquant ou invalide' },
        { status: 400 }
      );
    }

    const modulePath = path.join(
      process.cwd(),
      'public',
      'h5p-modules',
      moduleId
    );

    console.log('📂 Chemin de suppression:', modulePath);

    // Vérifier si le module existe
    try {
      await access(modulePath);
      console.log('✅ Module trouvé');
    } catch {
      console.error('❌ Module introuvable:', moduleId);
      return NextResponse.json(
        {
          success: false,
          error: `Module ${moduleId} introuvable`
        },
        { status: 404 }
      );
    }

    // Supprime tout le dossier du module
    await rm(modulePath, { recursive: true, force: true });

    console.log('✅ Module supprimé avec succès:', moduleId);

    return NextResponse.json({
      success: true,
      message: `Module ${moduleId} supprimé avec succès`,
      moduleId: moduleId
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (err: any) {
    console.error('❌ Erreur lors de la suppression:', err);
    
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Erreur lors de la suppression du module',
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