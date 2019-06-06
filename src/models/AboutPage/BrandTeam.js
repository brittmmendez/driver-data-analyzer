// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import TeamMember from './TeamMember';

const BrandTeam = types
  .model({
    title: types.optional(types.string, ''),
    body: types.optional(types.string, ''),
    teamMember: types.optional(types.array(TeamMember), []),
  })
  .actions(self => ({
    setBrandTeam(brandTeam) {
      self.title = brandTeam.items[0].fields.summaryHeading
      self.body = brandTeam.items[0].fields.summaryBody
      brandTeam.items[0].fields.brandTeamMember.map(member => { //eslint-disable-line
        self.teamMember.push({
          name: member.fields.brandTeamMemberName,
          position: member.fields.brandTeamMemberTitle,
          mediaFile: `https:${member.fields.brandTeamMemberImage.fields.file.url}`,
          mediaTitle: member.fields.brandTeamMemberImage.fields.title,
        });
      })
    }
  }))

export default BrandTeam;
