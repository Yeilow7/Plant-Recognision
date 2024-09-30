'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from 'framer-motion';

interface PlantInfo {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  imageUrl: string;
  qualityScore: number;
  rarityScore: number;
  care: {
    watering: string;
    light: string;
    temperature: string;
    soil: string;
  };
}

function getQualityColor(score: number): string {
  const hue = (score / 100) * 120;
  return `hsl(${hue}, 100%, 40%)`;
}

function getRarityColor(score: number): string {
  const hue = 240 - (score / 100) * 240; // Blue (240) for common, Red (0) for rare
  return `hsl(${hue}, 100%, 40%)`;
}

function PlantInfoCard({ info, darkMode, onCompare, isComparing, showRarity }: { 
  info: PlantInfo; 
  darkMode: boolean; 
  onCompare: (id: string) => void;
  isComparing: boolean;
  showRarity: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showCare, setShowCare] = useState(false);
  const qualityColor = getQualityColor(info.qualityScore);
  const rarityColor = getRarityColor(info.rarityScore);

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-2xl shadow-lg overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:scale-105`}>
      <div className="relative h-56">
        <Image src={info.imageUrl} alt={info.name} layout="fill" objectFit="cover" />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-bold">{info.name}</h2>
          <button
            onClick={() => onCompare(info.id)}
            className={`${isComparing ? 'bg-yellow-500 text-black' : darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'} px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200`}
          >
            {isComparing ? 'Comparing' : 'Compare'}
          </button>
        </div>
        <p className={`text-sm italic ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mb-3`}>{info.scientificName}</p>
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 flex-grow`}>
          {expanded ? (
            <>
              <p>{info.description}</p>
              <button
                onClick={() => setExpanded(false)}
                className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} font-semibold mt-2 focus:outline-none`}
              >
                Show less
              </button>
            </>
          ) : (
            <>
              <p className="inline">{info.description.slice(0, 100)}</p>
              {info.description.length > 100 && (
                <button
                  onClick={() => setExpanded(true)}
                  className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} font-semibold ml-1 focus:outline-none`}
                >
                  ...
                </button>
              )}
            </>
          )}
        </div>
        <div className="mt-2 mb-4">
          <button
            onClick={() => setShowCare(!showCare)}
            className={`${darkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-100 hover:bg-green-200 text-green-800'} px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200`}
          >
            {showCare ? 'Hide Care' : 'Care Instructions'}
          </button>
        </div>
        {showCare && (
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            <h3 className="font-semibold mb-2">Care Instructions:</h3>
            <ul className="list-disc pl-5">
              <li>Watering: {info.care.watering}</li>
              <li>Light: {info.care.light}</li>
              <li>Temperature: {info.care.temperature}</li>
              <li>Soil: {info.care.soil}</li>
            </ul>
          </div>
        )}
        <div className="mt-auto">
          <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Plant Quality:</p>
          <div className={`w-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-3`}>
            <div 
              className="h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${info.qualityScore}%`, backgroundColor: qualityColor }}
            ></div>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 mb-2`}>{info.qualityScore}% based on image analysis</p>
          
          {showRarity && (
            <>
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Plant Rarity:</p>
              <div className={`w-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-3`}>
                <div 
                  className="h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${info.rarityScore}%`, backgroundColor: rarityColor }}
                ></div>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{info.rarityScore}% (Higher = Rarer)</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlantIdentifier() {
  const [plantInfos, setPlantInfos] = useState<PlantInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showRarity, setShowRarity] = useState(false);
  const [comparingPlants, setComparingPlants] = useState<string[]>([]);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const toggleShowRarity = () => {
    setShowRarity(!showRarity);
  };

  const handleCompare = (id: string) => {
    setComparingPlants(prev => {
      if (prev.includes(id)) {
        return prev.filter(plantId => plantId !== id);
      } else if (prev.length < 2) {
        return [...prev, id];
      } else {
        return [prev[1], id];
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setLoading(true);
      setError(null);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const imageUrl = URL.createObjectURL(file);
          const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

          const prompt = "Identify this plant and provide its name, scientific name, a brief description, estimate its quality of life based on the image (as a percentage), estimate its rarity (as a percentage where higher means rarer), and provide care instructions including watering, light, temperature, and soil requirements. Format the response as follows:\nName: [plant name]\nScientific name: [scientific name]\nDescription: [description]\nQuality: [quality percentage]\nRarity: [rarity percentage]\nWatering: [watering instructions]\nLight: [light requirements]\nTemperature: [temperature range]\nSoil: [soil type]";
          const imageData = await fileToBase64(file);

          const result = await model.generateContent([
            prompt,
            {
              inlineData: {
                data: imageData,
                mimeType: file.type
              }
            }
          ]);
          const response = await result.response;
          const text = response.text();

          const parsedInfo = parsePlantInfo(text);
          const newPlantInfo: PlantInfo = {
            id: Date.now().toString() + i,
            ...parsedInfo,
            imageUrl
          };

          setPlantInfos(prev => [...prev, newPlantInfo]);
        } catch (error) {
          console.error('Error identifying plant:', error);
          setError(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      setLoading(false);
    }
  };

  function parsePlantInfo(text: string): { name: string; scientificName: string; description: string; qualityScore: number; rarityScore: number; care: { watering: string; light: string; temperature: string; soil: string; } } {
    text = text.replace(/\*/g, '');
    const lines = text.split('\n');
    let name = '', scientificName = '', description = '', qualityScore = 0, rarityScore = 0;
    let care = { watering: '', light: '', temperature: '', soil: '' };

    lines.forEach(line => {
      line = line.trim();
      if (line.toLowerCase().startsWith('name:')) {
        name = line.replace(/^name:\s*/i, '');
      } else if (line.toLowerCase().startsWith('scientific name:')) {
        scientificName = line.replace(/^scientific name:\s*/i, '');
      } else if (line.toLowerCase().startsWith('description:')) {
        description = line.replace(/^description:\s*/i, '');
      } else if (line.toLowerCase().startsWith('quality:')) {
        const qualityStr = line.replace(/^quality:\s*/i, '').replace('%', '');
        qualityScore = parseInt(qualityStr, 10) || 0;
      } else if (line.toLowerCase().startsWith('rarity:')) {
        const rarityStr = line.replace(/^rarity:\s*/i, '').replace('%', '');
        rarityScore = parseInt(rarityStr, 10) || 0;
      } else if (line.toLowerCase().startsWith('watering:')) {
        care.watering = line.replace(/^watering:\s*/i, '');
      } else if (line.toLowerCase().startsWith('light:')) {
        care.light = line.replace(/^light:\s*/i, '');
      } else if (line.toLowerCase().startsWith('temperature:')) {
        care.temperature = line.replace(/^temperature:\s*/i, '');
      } else if (line.toLowerCase().startsWith('soil:')) {
        care.soil = line.replace(/^soil:\s*/i, '');
      } else if (!description && line) {
        description += (description ? ' ' : '') + line;
      }
    });

    name = name.charAt(0).toUpperCase() + name.slice(1);
    scientificName = scientificName.charAt(0).toUpperCase() + scientificName.slice(1);
    description = description.charAt(0).toUpperCase() + description.slice(1);

    return { name, scientificName, description, qualityScore, rarityScore, care };
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to read file as base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 text-gray-900'} transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Plant<span className={darkMode ? 'text-green-400' : 'text-green-600'}>Identifier</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover the wonders of nature. Upload plant images and let AI reveal their secrets.
          </p>
        </motion.div>

        <div className="mb-12 text-center">
          <label htmlFor="file-upload" className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full ${darkMode ? 'text-gray-900 bg-green-400 hover:bg-green-300' : 'text-white bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:
          ring-offset-2 focus:ring-green-500 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Select plant image(s)
            <input id="file-upload" type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
          </label>
          <button
            onClick={toggleDarkMode}
            className={`ml-4 px-4 py-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'} transition-colors duration-300`}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={toggleShowRarity}
            className={`ml-4 px-4 py-2 rounded-full ${showRarity ? 'bg-purple-600 text-white' : darkMode ? 'bg-purple-800 text-white' : 'bg-purple-200 text-purple-800'} transition-colors duration-300`}
          >
            {showRarity ? 'Hide Rarity' : 'Show Rarity'}
          </button>
        </div>

        {loading && (
          <div className="text-center">
            <div className={`inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 ${darkMode ? 'border-green-400' : 'border-green-500'}`}></div>
            <p className={`mt-2 font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Identifying plants...</p>
          </div>
        )}

        {error && (
          <div className={`mt-4 p-4 ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-700'} rounded-lg text-center`}>
            {error}
          </div>
        )}

        {comparingPlants.length > 0 && (
          <div className={`mb-8 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
            <h3 className="text-xl font-bold mb-4">Comparing Plants:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plantInfos
                .filter(plant => comparingPlants.includes(plant.id))
                .map(plant => (
                  <div key={plant.id} className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                    <h4 className="font-bold">{plant.name}</h4>
                    <p className="text-sm italic">{plant.scientificName}</p>
                    <p className="mt-2"><strong>Quality:</strong> {plant.qualityScore}%</p>
                    {showRarity && <p><strong>Rarity:</strong> {plant.rarityScore}%</p>}
                    <p className="mt-2"><strong>Care:</strong> {plant.care.watering}, {plant.care.light}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {plantInfos.map((info, index) => (
            <motion.div
              key={info.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="h-full"
            >
              <PlantInfoCard 
                info={info} 
                darkMode={darkMode} 
                onCompare={handleCompare}
                isComparing={comparingPlants.includes(info.id)}
                showRarity={showRarity}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}