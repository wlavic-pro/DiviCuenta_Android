
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { extractItemsFromImage } from '../services/geminiService';
import { CameraIcon } from '../components/icons/CameraIcon';
import { Spinner } from '../components/Spinner';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';

export const ScanBill: React.FC = () => {
  const navigate = useNavigate();
  const { setItems, resetState } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPhoto = async (photo: Photo) => {
    if (photo.base64String) {
      setLoading(true);
      setError(null);
      try {
        resetState();
        const mimeType = `image/${photo.format}`;
        const ocrResult = await extractItemsFromImage(photo.base64String, mimeType);
        
        if (ocrResult && ocrResult.length > 0) {
          const itemsWithIds = ocrResult.map(item => ({ ...item, id: crypto.randomUUID() }));
          setItems(itemsWithIds);
          navigate('/edit');
        } else {
          setError('No se pudieron detectar productos en la boleta. Inténtalo de nuevo con una foto más clara.');
        }
      } catch (e: any) {
         console.error("Error processing image with Gemini:", e);
         setError(e.message || 'Ocurrió un error al procesar la imagen.');
      } finally {
          setLoading(false);
      }
    } else {
      setError('No se pudo obtener la imagen. Inténtalo de nuevo.');
    }
  };

  const captureAndProcessPhoto = async (source: CameraSource) => {
    try {
      const permission = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
      if (
        (source === CameraSource.Camera && permission.camera !== 'granted') ||
        (source === CameraSource.Photos && permission.photos !== 'granted')
      ) {
        setError('Permisos de cámara o galería denegados.');
        return;
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source,
      });
      await processPhoto(image);
    } catch (e: any) {
      // User cancellation is not an error.
      if (e.message && e.message.includes('User cancelled photos app')) {
        return;
      }
      console.error('Capacitor Camera error:', e);
      setError('Error al usar la cámara o galería. Asegúrate de tener los permisos.');
    }
  };

  const handleScanRequest = async () => {
    try {
      const result = await ActionSheet.showActions({
        title: 'Origen de la Boleta',
        message: '¿Cómo quieres escanear la boleta?',
        options: [
          { title: 'Tomar Foto', style: ActionSheetButtonStyle.Default },
          { title: 'Elegir de Galería', style: ActionSheetButtonStyle.Default },
          { title: 'Cancelar', style: ActionSheetButtonStyle.Cancel },
        ],
      });

      if (result.index === 0) { // Tomar Foto
        await captureAndProcessPhoto(CameraSource.Camera);
      } else if (result.index === 1) { // Elegir de Galería
        await captureAndProcessPhoto(CameraSource.Photos);
      }
    } catch (e) {
      console.error('Action Sheet error:', e);
    }
  };

  const handleManualEntry = () => {
    resetState();
    navigate('/edit', { state: { manualEntry: true } });
  };


  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-4 relative">
      {loading ? (
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-lg text-brand-gray">Analizando boleta...</p>
        </div>
      ) : (
        <>
            <button 
                onClick={() => navigate('/dashboard')} 
                className="absolute top-4 left-4 text-brand-gray hover:text-white">&larr; Volver</button>
            <div className="text-center w-full max-w-md">
              <CameraIcon className="h-20 w-20 text-brand-blue mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-brand-light mb-2">Escanear Cuenta</h1>
              <p className="text-brand-gray mb-8">Toma una foto o selecciona una imagen de tu boleta para detectar los productos automáticamente.</p>
              
              <button
                onClick={handleScanRequest}
                className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-3"
                aria-label="Escanear boleta"
              >
                <CameraIcon className="w-6 h-6" />
                <span>Escanear Boleta</span>
              </button>

              <button
                onClick={handleManualEntry}
                className="mt-6 text-brand-gray font-semibold hover:text-white transition duration-300"
              >
                o ingresar productos manualmente
              </button>

              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </>
      )}
    </div>
  );
};
