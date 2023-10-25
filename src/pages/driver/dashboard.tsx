import GoogleMapReact from "google-map-react";
import { useCallback, useEffect, useState } from "react";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { Order, TakeOrderInput, TakeOrderOutput } from "../../gql/graphql";
import { GOOGLE_MAP_API_KEY } from "../../env";

const COOCKED_ORDERS_SUBSCRIPTION = gql`
  subscription coockedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

export const DashBoardPage = () => {
  const history = useHistory();

  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();

  const { data: coockedOrdersData } = useSubscription<{ cookedOrders: Order }>(
    COOCKED_ORDERS_SUBSCRIPTION
  );

  const onSucces = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };

  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };

  const onApiLoaded = ({ map, maps }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
    // const geocoder = new google.maps.Geocoder();
    // geocoder.geocode(
    //   {
    //     location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
    //   },
    //   (results, status) => {
    //     console.log(status, results);
    //   }
    // );
  };

  const makeRoute = useCallback(() => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  }, [driverCoords, map]);

  const [takeOrderMutation] = useMutation<
    { takeOrder: TakeOrderOutput },
    { input: TakeOrderInput }
  >(TAKE_ORDER_MUTATION, {
    onCompleted: (data) => {
      if (data.takeOrder.ok) {
        history.push(`/orders/${coockedOrdersData?.cookedOrders.id}`);
      }
    },
  });

  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          orderId,
        },
      },
    });
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
  }, [driverCoords.lat, driverCoords.lng, map, maps]);

  useEffect(() => {
    if (coockedOrdersData?.cookedOrders.id) {
      console.log(coockedOrdersData);
      makeRoute();
    }
  }, [coockedOrdersData, makeRoute]);

  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          draggable
          defaultZoom={16}
          defaultCenter={{
            lat: 36.58,
            lng: 125.95,
          }}
          bootstrapURLKeys={{
            key: GOOGLE_MAP_API_KEY,
          }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {coockedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className="text-center  text-3xl font-medium">
              New Coocked Order
            </h1>
            <h1 className="text-center my-3 text-2xl font-medium">
              Pick it up soon @{" "}
              {coockedOrdersData?.cookedOrders.restaurant?.name}
            </h1>
            <button
              className="btn w-full  block  text-center mt-5"
              onClick={() => triggerMutation(coockedOrdersData.cookedOrders.id)}
            >
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center  text-3xl font-medium">
            No orders yet...
          </h1>
        )}
      </div>
    </div>
  );
};

const Driver = (props: { lat: number; lng: number }) => (
  <div className="text-lg">🚖</div>
);
