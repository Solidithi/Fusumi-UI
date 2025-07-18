import sharp from "sharp";
import path from "path";

/**
 * Creates a sliding door overlay effect on a background image using a separate door graphic.
 * The 'percentageCoveredByEachDoor' determines how much of the background image's width
 * is covered by each door from its respective side.
 *
 * @param inputImagePath The path to the background image.
 * @param doorImagePath The path to the single door graphic (e.g., shoji screen).
 * @param outputPath The path where the resulting image with the overlay will be saved.
 * @param percentageCoveredByEachDoor The percentage of the background image's width that each door should cover.
 * 0 means fully open (no doors visible), 50 means fully closed (doors meet in center).
 */
export async function createSlidingDoorOverlay(
  inputImagePath: string,
  doorImagePath: string, // New parameter for the separate door image
  outputPath: string,
  percentageCoveredByEachDoor: number = 25 // Each door covers this percentage of the *background image's* width
): Promise<void> {
  try {
    if (percentageCoveredByEachDoor < 0 || percentageCoveredByEachDoor > 50) {
      throw new Error("percentageCoveredByEachDoor must be between 0 and 50.");
    }

    const { width: imageWidth, height: imageHeight } = await sharp(
      inputImagePath
    ).metadata();

    if (!imageWidth || !imageHeight) {
      throw new Error("Could not get image dimensions.");
    }

    // Resize door image to match background height
    const resizedDoor = sharp(doorImagePath).resize({
      height: imageHeight,
      fit: "cover",
    });

    // Get new door image dimensions
    const { width: doorImageWidth, height: doorHeight } =
      await resizedDoor.metadata();

    const doorRenderWidth = Math.round(
      (imageWidth * percentageCoveredByEachDoor) / 100
    );

    if (doorRenderWidth > doorImageWidth) {
      throw new Error(
        "doorRenderWidth exceeds door image width after resizing."
      );
    }

    // Crop right door (leftmost part)
    const croppedRightDoor = resizedDoor.clone().extract({
      left: 0,
      top: 0,
      width: doorRenderWidth,
      height: doorHeight,
    });

    // Crop left door (rightmost part)
    const croppedLeftDoor = resizedDoor
      .clone()
      .extract({
        left: doorImageWidth - doorRenderWidth,
        top: 0,
        width: doorRenderWidth,
        height: doorHeight,
      })
      .flop();

    // Start with the original background image as the base for compositing
    const image = sharp(inputImagePath);

    // Define the composite operations for the left and right doors
    const compositeOperations = [
      {
        input: await croppedLeftDoor.toBuffer(),
        left: 0,
        top: 0,
      },
      {
        input: await croppedRightDoor.toBuffer(),
        left: imageWidth - doorRenderWidth,
        top: 0,
      },
    ];

    // Perform the compositing and save the output file
    await image.composite(compositeOperations).toFile(outputPath);

    console.log(`Sliding door overlay created at: ${outputPath}`);
  } catch (error) {
    console.error("Error creating sliding door overlay:", error);
  }
}

// --- Usage Example ---
const inputImage: string = path.join(
  process.cwd(),
  "public/data/nft-base-images/tier-1/healthcare.png"
);

const shojiDoorImage: string = path.join(
  process.cwd(),
  "public/data/nft-assets/shoji-overlay.jpg"
);
const outputImage: string = path.join(process.cwd(), "public/test-overlay.png");

createSlidingDoorOverlay(inputImage, shojiDoorImage, outputImage, 25); // Each door covers 25% of the background
