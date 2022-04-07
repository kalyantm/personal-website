import CampFire from "./campfire";
import Celestial from "./celestial";
import Dog from "./dog";
import Man from "./man";
import Mountains from "./mountains";
import Skeleton from "./skeleton";
import Surface from "./surface";
import Tent from "./tent";

export default function Illustration() {
  return (
    <Skeleton>
      <Celestial />
      <Mountains />
      <Surface />
      <Tent />
      <Man />
      <Dog />
      <CampFire />
    </Skeleton>
  );
}