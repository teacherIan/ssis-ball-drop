import * as PIXI from 'pixi.js';
import { ShockwaveFilter } from '@pixi/filter-shockwave';
import { AsciiFilter } from '@pixi/filter-ascii';
import { AdvancedBloomFilter } from '@pixi/filter-advanced-bloom';
import { PixelateFilter } from '@pixi/filter-pixelate';

PIXI.Filter.defaultResolution = 2;

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
      // antialias: true,
      resizeTo: parent,
      powerPreference: 'high-performance',
      resolution: Math.min(window.devicePixelRatio, 2),
      autoDensity: true,
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
      letterSpacing: 10,
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
    backgroundSprite.eventMode = 'dynamic';
    backgroundSprite.cursor = 'pointer';
    this.stage.addChild(backgroundSprite);
    backgroundSprite.width = window.innerHeight * 1.5;
    backgroundSprite.height = window.innerHeight * 1.5;
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

    displacementSpriteFilter.scale.x = 64;
    displacementSpriteFilter.scale.y = 64;

    displacementSpriteFilter.autoFit = false;
    displacementSpriteFilter.padding = 100;

    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

    const asciiFilter = new AsciiFilter();
    asciiFilter.size = 6; //6
    // asciiFilter.autoFit = true;
    // asciiFilter.padding = 100;
    // asciiFilter.blendMode = PIXI.BLEND_MODES.ADD;

    // const shockWaveFilter = new ShockwaveFilter(
    //   [Math.random() * window.innerWidth, Math.random() * window.innerHeight],
    //   {
    //     amplitude: 200,
    //     wavelength: 400,
    //     brightness: 1,
    //     speed: 50,
    //     radius: -1,
    //   }
    // );

    const bloomFilter = new AdvancedBloomFilter({
      threshold: 0.5,
      bloomScale: 50.5,
      brightness: 2,
      blur: 0.0,
      quality: 20.0,
    });

    const pixelateFilter = new PixelateFilter(6);

    // let num = Math.random();

    // if (num > 0.5) {
    //   this.stage.filters = [bloomFilter, asciiFilter, displacementSpriteFilter];
    // } else {
    //   this.stage.filters = [displacementSpriteFilter];
    // }

    this.stage.filters = [displacementSpriteFilter];

    let currentTime = 0;

    this.app.ticker.add(() => {
      backgroundSprite.rotation += 0.0005;

      displacementSprite.x += 0.5;
      displacementSprite.y += 0.5;
      currentTime += 0.001;

      displacementSpriteFilter.scale.x = Math.cos(currentTime) * 300;
      // displacementSpriteFilter.scale.y = 100;
    });

    return displacementSprite;
  }
}
