import heroImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-sahara-desert-landscape-trees.jpeg'
import wildlifeOryxImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-sahara-wildlife-oryx-herd.jpeg'
import convoyImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-desert-4x4-convoy-morocco.jpeg'
import archaeologyImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-archaeology-monument-group-tour.jpeg'
import conservationSignImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-leghchiwate-addax-conservation-sign.jpeg'
import hikingImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-sahara-dune-hiking-tourism.jpeg'
import dunesGroupImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-sahara-dunes-group-photo.jpeg'
import tourImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-morocco-desert-4x4-tour.jpeg'
import standingStoneImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-standing-stone-group-tourism.jpeg'
import wildlifeAddaxImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-sahara-wildlife-addax-tourism.jpeg'
import trekkingImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-desert-dune-trekking-expedition.jpeg'
import astrotourismImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-astrotourism-telescope-night-sky.jpeg'
import bivouacImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-bivouac-traditional-tent-reception.jpeg'
import archaeologicalSiteImage from '../assets/SMARA DISCOVERY EXPERIENCE/smara-discovery-experience-archaeological-rock-art-site.jpeg'

/** Hero background — keep as the primary landscape shot. */
export const smaraDiscoveryHeroImage = heroImage

/** Single featured image for the About section. */
export const smaraDiscoveryAboutImage = {
  src: dunesGroupImage,
  altKey: 'smaraDiscoveryGalleryAltDunesGroup',
}

/**
 * Gallery only — each src is unique within this list.
 * Near-duplicate scenes (second standing-stone / second antelope herd)
 * are reserved for other sections instead of shown side by side here.
 */
export const smaraDiscoveryGalleryImages = [
  { src: wildlifeOryxImage, altKey: 'smaraDiscoveryGalleryAltWildlifeOryx' },
  { src: convoyImage, altKey: 'smaraDiscoveryGalleryAltConvoy' },
  { src: archaeologyImage, altKey: 'smaraDiscoveryGalleryAltArchaeology' },
  { src: conservationSignImage, altKey: 'smaraDiscoveryGalleryAltConservation' },
  { src: hikingImage, altKey: 'smaraDiscoveryGalleryAltHiking' },
  { src: tourImage, altKey: 'smaraDiscoveryGalleryAltTour' },
  { src: trekkingImage, altKey: 'smaraDiscoveryGalleryAltTrekking' },
]

/** Activity cards — one distinct image per activity (no repeats in this section). */
export const smaraDiscoveryActivityImages = {
  astrotourism: astrotourismImage,
  bivouac: bivouacImage,
  hiking: hikingImage,
  archaeological_sites: archaeologicalSiteImage,
  hassani_culture: tourImage,
  wildlife_observation: wildlifeAddaxImage,
  photography: convoyImage,
}

/**
 * Why visit collage — three visually different themes only.
 * Do not reuse the same asset twice in this array.
 */
export const smaraDiscoveryWhyVisitImages = [
  { src: standingStoneImage, altKey: 'smaraDiscoveryGalleryAltStandingStone' },
  { src: wildlifeAddaxImage, altKey: 'smaraDiscoveryGalleryAltWildlifeAddax' },
  { src: conservationSignImage, altKey: 'smaraDiscoveryGalleryAltConservation' },
]
