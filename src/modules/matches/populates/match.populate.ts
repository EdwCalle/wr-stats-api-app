export class MatchPopulate {
  static season = {
    path: 'seasonID'
  };
  static seasonProfile = {
    path: 'seasonProfileID',
    populate: this.season
  };
  static rankedTier = {
    path: 'range.rankedTierID'
  };
}
