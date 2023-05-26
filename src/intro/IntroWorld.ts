import * as PIXI from 'pixi.js';
import { ShockwaveFilter } from '@pixi/filter-shockwave';
import { AsciiFilter } from '@pixi/filter-ascii';
import { AdvancedBloomFilter } from '@pixi/filter-advanced-bloom';
import { PixelateFilter } from '@pixi/filter-pixelate';

export default class IntroWorld {
  private app: PIXI.Application;
  private stage: PIXI.Container;

  private element: HTMLCanvasElement;
  private parent;

  constructor(parent: HTMLCanvasElement) {
    this.parent = parent;
    this.app = new PIXI.Application({
      view: parent,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x101935,
      backgroundAlpha: 1,
      antialias: true,
      resizeTo: parent,
      powerPreference: 'high-performance',
    });
    this.stage = this.app.stage;
    this.element = document.body.appendChild(
      this.app.view as HTMLCanvasElement
    );

    this.createDisplacementSprite();
    this.app.stage.sortableChildren = true;
  }

  public getStage(): PIXI.Container {
    return this.stage;
  }

  public getApp(): PIXI.Application {
    return this.app;
  }

  public createText(text: string) {
    const style = new PIXI.TextStyle({
      fontFamily: 'Impact',
      fontSize: window.innerHeight / 4 + 15,
      fill: 'white',
      stroke: '#ff3300',
      strokeThickness: 10,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 0,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 20,
      // letterSpacing: 20,
    });
    const richText = new PIXI.Text(text, style);
    richText.x = window.innerWidth / 2;
    richText.y = window.innerHeight / 2;
    richText.anchor.set(0.5);
    richText.scale.y = 1.5;
    richText.scale.x = 1.2;
    richText.alpha = 1;

    this.app.ticker.add(() => {
      // richText.rotation += 0.0005;
    });

    window.addEventListener('resize', () => {
      richText.x = window.innerWidth / 2;
      richText.y = window.innerHeight / 2;
      window.innerHeight / 4 + 15;
      this.element.width = window.innerWidth;
      this.element.height = window.innerHeight;
    });

    return richText;
  }

  public async createDisplacementSprite() {
    // await PIXI.Assets.cache.get('introBackground');
    let bg = await PIXI.Assets.load('/SSIS__logo.png');
    console.log(bg);
    const backgroundSprite = new PIXI.Sprite(bg);
    backgroundSprite.interactive = true;
    backgroundSprite.cursor = 'pointer';
    this.stage.addChild(backgroundSprite);
    backgroundSprite.width = window.innerHeight * 1.3;
    backgroundSprite.height = window.innerHeight * 1.3;
    backgroundSprite.anchor.set(0.5);
    backgroundSprite.x = this.app.screen.width / 2;
    backgroundSprite.y = this.app.screen.height / 2;
    let displacementMap = await PIXI.Assets.load(
      '/displacement_map_repeat.jpg'
    );

    const displacementSprite = new PIXI.Sprite(displacementMap);
    this.stage.addChild(displacementSprite);
    const displacementSpriteFilter = new PIXI.DisplacementFilter(
      displacementSprite
    );

    window.addEventListener('resize', () => {
      backgroundSprite.width = window.innerHeight * 1.5;
      backgroundSprite.height = window.innerHeight * 1.5;
      backgroundSprite.x = window.innerWidth / 2;
      backgroundSprite.y = window.innerHeight / 2;
    });

    displacementSpriteFilter.scale.x = 600;
    displacementSpriteFilter.scale.y = 300;
    displacementSpriteFilter.resolution = 2;
    displacementSpriteFilter.autoFit = true;

    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

    const asciiFilter = new AsciiFilter();
    asciiFilter.size = 7; //6
    // asciiFilter.autoFit = true;
    // asciiFilter.padding = 100;
    // asciiFilter.blendMode = PIXI.BLEND_MODES.ADD;
    asciiFilter.resolution = 2;

    const shockWaveFilter = new ShockwaveFilter(
      [Math.random() * window.innerWidth, Math.random() * window.innerHeight],
      {
        amplitude: 200,
        wavelength: 400,
        brightness: 1,
        speed: 50,
        radius: -1,
      }
    );

    const bloomFilter = new AdvancedBloomFilter({
      threshold: 1,
      bloomScale: 50.5,
      brightness: 2.1,
      blur: 0.0,
      quality: 20.0,
    });

    const pixelateFilter = new PixelateFilter(12);

    this.stage.filters = [
      displacementSpriteFilter,
      bloomFilter,
      // shockWaveFilter,
      // pixelateFilter,
      asciiFilter,
    ];

    let currentTime = 0;

    this.app.ticker.add(() => {
      backgroundSprite.rotation += 0.0005;

      displacementSprite.x += 1;
      displacementSprite.y += 1;
      currentTime += 0.005;

      displacementSpriteFilter.scale.x = Math.cos(currentTime) * 200;
      displacementSpriteFilter.scale.y = 100;

      shockWaveFilter.time += 0.1;
      if (shockWaveFilter.time > 60) {
        shockWaveFilter.time = 0;
        shockWaveFilter.center = [
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
        ];
      }
    });

    return displacementSprite;
  }
}
