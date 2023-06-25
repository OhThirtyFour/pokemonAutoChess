import Player from "../../models/colyseus-models/player"
import { PokemonAvatarModel } from "../../models/colyseus-models/pokemon-avatar"
import { FloatingItem } from "../../models/colyseus-models/floating-item"
import Shop from "../../models/shop"
import Design, { DesignTiled } from "../../core/design"
import BotManager from "../../core/bot-manager"
import { DungeonData, Dungeon, StageDuration } from "../../types/Config"
import { GamePhaseState } from "../../types/enum/Game"
import { Weather } from "../../types/enum/Weather"
import {
  Schema,
  MapSchema,
  ArraySchema,
  type,
  SetSchema
} from "@colyseus/schema"
import { Pkm } from "../../types/enum/Pokemon"
import { pickRandomIn } from "../../utils/random"
import { SlingshotBox } from "../../models/colyseus-models/slingshot-box"

export default class GameState extends Schema {
  @type("string") afterGameId = ""
  @type("uint8") roundTime = StageDuration[1]
  @type("uint8") phase = GamePhaseState.PICK
  @type({ map: Player }) players = new MapSchema<Player>()
  @type({ map: PokemonAvatarModel }) avatars = new MapSchema<PokemonAvatarModel>()
  @type({ map: PokemonAvatar }) slingShotAvatars =
    new MapSchema<PokemonAvatar>()
  @type({ map: FloatingItem }) floatingItems = new MapSchema<FloatingItem>()
  @type({ map: SlingshotBox }) slingShotBoxes = new MapSchema<SlingshotBox>()
  @type(["string"]) additionalPokemons = new ArraySchema<Pkm>()
  @type("uint8") stageLevel = 1
  @type("string") mapName: string
  @type("string") weather: Weather
  @type("boolean") noElo = false
  @type({ set: "string" }) spectators = new SetSchema<string>()
  time = StageDuration[1] * 1000
  botManager: BotManager = new BotManager()
  shop: Shop = new Shop()
  id: Dungeon
  design: Design
  tilemap: DesignTiled | undefined
  gameFinished = false
  gameLoaded = false
  name: string
  startTime: number
  endTime: number | undefined = undefined
  preparationId: string
  shinyEncounter = false

  constructor(preparationId: string, name: string, noElo: boolean) {
    super()
    this.preparationId = preparationId
    this.startTime = Date.now()
    this.name = name
    this.id = pickRandomIn(Dungeon)
    this.noElo = noElo
    this.mapName = DungeonData[this.id].name
    this.weather = Weather.NEUTRAL
    this.design = new Design(this.id, 5, 0.1)
    this.design.create().then(() => {
      this.tilemap = this.design.exportToTiled()
    })
  }
}
