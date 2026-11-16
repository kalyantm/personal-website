import { EASY_HR, RUN_BUILD, WEEKLY_TARGETS } from "~/lib/fitness/targets";
import { InfoTip } from "./ui/info-tip";

/** One explainer per section, shown from the (i) next to its title. */

export const ThisWeekInfo = () => (
  <InfoTip title="This week">
    <p>
      Every activity you&apos;ve recorded on Garmin since Monday, by day. The bars measure the week against your targets: {WEEKLY_TARGETS.run.amount} km of
      running, {WEEKLY_TARGETS.bike.amount} km on the bike and {WEEKLY_TARGETS.gym.amount} strength sessions. Swim has no target until you start.
    </p>
    <p>Nothing here is planned or predicted. It only shows what happened.</p>
  </InfoTip>
);

export const ProgressMarkersInfo = () => (
  <InfoTip title="Progress markers">
    <p>
      Slow-moving numbers that show whether your fitness is actually improving, one value per week. Look at the direction over a month or more, not at
      single weeks.
    </p>
    <p>
      VO₂ max comes straight from Garmin. Easy pace is your running pace at {EASY_HR.low}–{EASY_HR.high} bpm, the top of your zone 2, measured from each
      run&apos;s second-by-second data with walking breaks left out. Threshold, swim CSS and bike FTP need data Garmin doesn&apos;t share yet.
    </p>
  </InfoTip>
);

export const RecoveryInfo = () => (
  <InfoTip title="Recovery">
    <p>
      How well you&apos;re absorbing training, from your watch. HRV and resting HR are measured overnight; Body Battery and stress are live and show the
      latest reading your watch has synced.
    </p>
    <p>
      Open a tile for detail. &ldquo;Today&rdquo; is the last 24 hours up to now for HRV, heart rate and Body Battery. Garmin only reports sleep stages and
      stress as totals, so for those &ldquo;Today&rdquo; shows last night&apos;s sleep window and stages, and today&apos;s time at each stress level. The day
      ranges compare each day with your own baseline.
    </p>
    <p>Read the five together: one odd number is noise, several moving the same way is a signal.</p>
  </InfoTip>
);

export const RunBuildInfo = () => (
  <InfoTip title="Run build">
    <p>
      Your weekly running kilometres from Garmin, starting with the first week you ran. Solid bars are done; the faded bars to the right project how volume
      could grow from this week&apos;s {WEEKLY_TARGETS.run.amount} km toward {RUN_BUILD.target} km using the ramp you pick.
    </p>
    <p>
      The single-run cap is 10% past your longest run in the last 30 days, because single runs well beyond that are linked to more injuries. The checks
      below only use data Garmin actually has.
    </p>
  </InfoTip>
);

export const FuelInfo = () => (
  <InfoTip title="Fuel today">
    <p>
      Carbohydrate and protein targets for today, scaled to your latest Garmin body weight and how hard the day is. The day type is preselected from the
      training Garmin has recorded today; switch it to see how the targets change.
    </p>
    <p>&ldquo;Eaten so far&rdquo; stays empty until phase 2 brings in meals from Cal AI through Apple Health.</p>
  </InfoTip>
);

export const FitnessFormInfo = () => (
  <InfoTip title="Fitness and form">
    <p>
      Built from Garmin&apos;s training load for every activity. Fitness is your load averaged over about six weeks, fatigue over about one week, and form is
      fitness minus fatigue.
    </p>
    <p>
      Negative form in a hard week is normal. Before a race you want it positive (about +10 to +25). Rides recorded without heart rate add almost no load,
      so fitness reads low until most sessions have HR.
    </p>
  </InfoTip>
);
