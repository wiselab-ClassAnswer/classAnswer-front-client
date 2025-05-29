// 20250421 김범수
// 미사용으로 인한 주석 처리
// 사용 시 하단 라이브러리 설치 필요

// import * as mammoth  from "mammoth";
// import parsePptx     from "pptx-parser";
// import JSZip         from "jszip";
// import { XMLParser } from "fast-xml-parser";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// import worker        from "pdfjs-dist/legacy/build/pdf.worker.js";

// pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

// export const GPTFileUtil = {
//     async docxToText(file) {
//       try {
//         const arrayBuffer = await file.arrayBuffer();
//         const result = await mammoth.extractRawText({ arrayBuffer });
//         return result.value; // 추출된 텍스트
//       } catch (error) {
//         console.error("DOCX 파싱 오류:", error);
//         return "";
//       }
//     },
//     async pptToText(file) {
//         const zip = await JSZip.loadAsync(file);
//         const parser = new XMLParser();
    
//         const texts = [];
//         const images = [];
//         const shapes = [];
    
//         const slideFiles = Object.keys(zip.files).filter(name =>
//           name.startsWith("ppt/slides/slide") && name.endsWith(".xml")
//         );
    
//         for (const fileName of slideFiles) {
//           const slideXml = await zip.files[fileName].async("text");
//           const slideParsed = parser.parse(slideXml);
    
//           // (1) 텍스트 & 도형 추출
//           const spTree = slideParsed?.["p:sld"]?.["p:cSld"]?.["p:spTree"] || {};
//           const shapeItems = spTree["p:sp"] || [];
//           const shapeArray = Array.isArray(shapeItems) ? shapeItems : [shapeItems];
    
//           for (const shape of shapeArray) {
//             //  도형 형태 추출
//             const shapeType = shape?.["p:spPr"]?.["a:prstGeom"]?.["@_prst"];
//             if (shapeType) {
//               shapes.push(shapeType); 
//             }
    
//             //  텍스트 추출
//             const paragraphs = shape?.["p:txBody"]?.["a:p"];
//             const paraArray = Array.isArray(paragraphs) ? paragraphs : [paragraphs];
//             for (const para of paraArray) {
//               const runs = para?.["a:r"];
//               const runArray = Array.isArray(runs) ? runs : [runs];
//               for (const run of runArray) {
//                 const text = run?.["a:t"];
//                 if (text) texts.push(text);
//               }
//             }
//           }
    
//           // (2) 이미지 추출
//           const relsPath = `ppt/slides/_rels/${fileName.split("/").pop()}.rels`;
//           if (zip.files[relsPath]) {
//             const relXml = await zip.files[relsPath].async("text");
//             const relParsed = parser.parse(relXml);
//             const rels = relParsed?.["Relationships"]?.["Relationship"] || [];
//             const relArray = Array.isArray(rels) ? rels : [rels];
    
//             for (const rel of relArray) {
//               if (rel.Type?.includes("image")) {
//                 const target = rel.Target.replace(/^(\.\.\/)+media\//, "ppt/media/");
//                 const imageFile = zip.files[target];
//                 if (imageFile) {
//                   const blob = await imageFile.async("blob");
//                   const base64 = await blobToBase64(blob); // base64로 저장
//                   images.push(base64);
//                 }
//               }
//             }
//           }
//         }
    
//         return {
//           texts,   // 텍스트 배열
//           images,  // base64 이미지 배열
//           shapes   // 도형 타입 배열
//         };
//       },
    
//     // 유틸 함수: Blob → base64 (Data URL)
//     async  blobToBase64(blob) {
//       return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onloadend = () => resolve(reader.result); // base64 string
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//       });
//     },
//       async pdfToTextAndImages(file) {
//         const arrayBuffer = await file.arrayBuffer();
//         const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
//         const texts = [];
//         const images = [];
    
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const content = await page.getTextContent();
//           const pageText = content.items.map(item => item.str).join(" ");
//           texts.push(pageText);
    
//           const viewport = page.getViewport({ scale: 1.5 });
//           const canvas = document.createElement("canvas");
//           const context = canvas.getContext("2d");
    
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;
    
//           await page.render({ canvasContext: context, viewport }).promise;
//           const imageUrl = canvas.toDataURL("image/png");
//           images.push(imageUrl);
//         }
    
//         return {
//           texts,
//           images
//         };
//       }
//   };