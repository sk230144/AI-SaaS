import puter from "@heyputer/puter.js";
import { ROOMIFY_RENDER_PROMPT } from "./constants";

export const fetchAsDataUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const generate3DView = async ({ sourceImage }: Generate3DViewParams) => {
    const dataUrl = sourceImage.startsWith('data:')
        ? sourceImage
        : await fetchAsDataUrl(sourceImage);

    const base64Data = dataUrl.split(',')[1];
    const mimeType = dataUrl.split(';')[0].split(':')[1];

    if (!mimeType || !base64Data) throw new Error('Invalid source image payload');

    const response = await puter.ai.txt2img(ROOMIFY_RENDER_PROMPT, {
        provider: "gemini",
        model: "gemini-2.5-flash-image-preview",
        input_image: base64Data,
        input_image_mime_type: mimeType,
        ratio: { w: 1024, h: 1024 },
    });

    const rawImageUrl = (response as HTMLImageElement).src ?? null;

    if (!rawImageUrl) return { renderedImage: null, renderedPath: undefined };

    const renderedImage = rawImageUrl.startsWith('data:')
        ? rawImageUrl : await fetchAsDataUrl(rawImageUrl);

    return { renderedImage, renderedPath: undefined };
}

export const generate3DViewEdited = async ({
    sourceImage,
    currentRender,
    editPrompt,
}: {
    sourceImage: string;
    currentRender: string;
    editPrompt: string;
}) => {
    // Always use the original 2D plan as the primary input image (layout anchor)
    const dataUrl = sourceImage.startsWith('data:')
        ? sourceImage
        : await fetchAsDataUrl(sourceImage);

    const base64Data = dataUrl.split(',')[1];
    const mimeType = dataUrl.split(';')[0].split(':')[1];

    if (!mimeType || !base64Data) throw new Error('Invalid source image payload');

    // Include the current render as context in the prompt
    const currentRenderDataUrl = currentRender.startsWith('data:')
        ? currentRender
        : await fetchAsDataUrl(currentRender);

    const currentRenderBase64 = currentRenderDataUrl.split(',')[1];
    const currentRenderMime = currentRenderDataUrl.split(';')[0].split(':')[1];

    // Build the full edit prompt: reference the current render for context, use 2D plan for layout anchor
    const fullPrompt = `
REFERENCE IMAGES PROVIDED:
- Image 1 (input_image): The ORIGINAL 2D floor plan. Use this as the STRUCTURAL ANCHOR — all walls, rooms, doors, and windows must match this exactly.
- Image 2 (context): The CURRENT 3D render. Use this as the VISUAL REFERENCE for materials, lighting, furniture positions, and rendering style.

EDIT INSTRUCTION:
${editPrompt}

ABSOLUTE CONSTRAINTS:
- Preserve the exact wall layout from the 2D floor plan at all times.
- Maintain top-down orthographic view (camera directly above, 90°, no tilt, no perspective).
- Output must be photorealistic, 2K quality, no text, no watermarks, no labels.
- Match the rendering quality and style of the current 3D render unless the edit instruction specifies a style change.
`.trim();

    const response = await puter.ai.txt2img(fullPrompt, {
        provider: "gemini",
        model: "gemini-2.5-flash-image-preview",
        input_image: base64Data,
        input_image_mime_type: mimeType,
        ratio: { w: 1024, h: 1024 },
    });

    const rawImageUrl = (response as HTMLImageElement).src ?? null;

    if (!rawImageUrl) return { renderedImage: null };

    const renderedImage = rawImageUrl.startsWith('data:')
        ? rawImageUrl
        : await fetchAsDataUrl(rawImageUrl);

    return { renderedImage };
}