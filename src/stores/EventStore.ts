import { createContext } from 'react';

import { action, observable } from 'mobx';

import { FRCEvent, FRCRobotEntry, TBAMatch } from '@/types';

class EventStore {
  @observable events: { [key: string]: FRCEvent } = observable({});

  @action.bound
  loadEvent(eventSlug: string): Promise<FRCEvent> {
    if (this.events[eventSlug] !== undefined) {
      return new Promise((resolve) => {
        resolve(this.events[eventSlug]);
      });
    }

    return fetch(`${process.env.PREFIX_PATH}/event_data/${eventSlug}.json`)
      .then((res) => res.json())
      .then((eventData) => {
        this.events[eventSlug] = {
          slug: eventSlug,
          robotEntries: eventData.map(this.hydrateRobotEntry),
          tba: {},
        };
      })
      .then(() =>
        fetch(`${process.env.PREFIX_PATH}/event_data/${eventSlug}_tba.json`)
      )
      .then((res) => res.json())
      .then((tbaData: TBAMatch[]) => {
        this.events[eventSlug].tba = Object.fromEntries(
          tbaData.map((tbaMatch) => [tbaMatch.key, tbaMatch])
        );
        return this.events[eventSlug];
      });
  }

  hydrateRobotEntry(rawMatch: { [key: string]: string }): FRCRobotEntry {
    return {
      matchNumber: parseInt(rawMatch['Match Number']),
      teamNumber: parseInt(rawMatch['Team Number']),
      autonomousPath: eval(rawMatch['Autonomous Path']),
      autoCrossLine: rawMatch['Auto Cross Line'] == '1',
      autoSwitchCubes: parseInt(rawMatch['Auto Switch Cubes']),
      autoScaleCubes: parseInt(rawMatch['Auto Scale Cubes']),
      ownSwitchCubesTeleop: parseInt(rawMatch['Own Switch Cubes Teleop']),
      scaleCubesTeleop: parseInt(rawMatch['Scale Cubes Teleop']),
      oppSwitchCubesTeleop: parseInt(rawMatch['Opponent Switch Cubes Teleop']),
      exchangeCubes: parseInt(rawMatch['Exchange Cubes']),
      singleClimb: rawMatch['Single Climb'] == '1',
      climbWithOneBuddy: rawMatch['Climb + 1 Buddy'] == '1',
      climbWithTwoBuddies: rawMatch['Climb + 2 Buddies'] == '1',
      playedDefense: rawMatch['Played Defense'] == '1',
    };
  }
}

export const EventContext = createContext<EventStore>(null);

export default EventStore;
