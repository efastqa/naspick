import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Driver, Ride, CustomerUser } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const DRIVERS_COLLECTION = 'drivers';
const RIDES_COLLECTION = 'rides';
const USERS_COLLECTION = 'users';

// Real-time synchronization for driver partners
export function subscribeToDrivers(onUpdate: (drivers: Driver[]) => void) {
  try {
    const q = query(collection(db, DRIVERS_COLLECTION), limit(100));
    return onSnapshot(q, (snapshot) => {
      const drivers: Driver[] = [];
      snapshot.forEach((docSnap) => {
        drivers.push(docSnap.data() as Driver);
      });
      onUpdate(drivers);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, DRIVERS_COLLECTION);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, DRIVERS_COLLECTION);
    return () => {};
  }
}

// Persist new or updated driver to cloud database
export async function saveDriverToCloud(driver: Driver): Promise<void> {
  const path = `${DRIVERS_COLLECTION}/${driver.id}`;
  try {
    const driverRef = doc(db, DRIVERS_COLLECTION, driver.id);
    await setDoc(driverRef, {
      ...driver,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Real-time synchronization for active rides
export function subscribeToActiveRides(onUpdate: (rides: Ride[]) => void) {
  try {
    const q = query(collection(db, RIDES_COLLECTION), limit(50));
    return onSnapshot(q, (snapshot) => {
      const rides: Ride[] = [];
      snapshot.forEach((docSnap) => {
        rides.push(docSnap.data() as Ride);
      });
      onUpdate(rides);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, RIDES_COLLECTION);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, RIDES_COLLECTION);
    return () => {};
  }
}

// Save or update ride in cloud database
export async function saveRideToCloud(ride: Ride): Promise<void> {
  const path = `${RIDES_COLLECTION}/${ride.id}`;
  try {
    const rideRef = doc(db, RIDES_COLLECTION, ride.id);
    await setDoc(rideRef, {
      ...ride,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Save user profile in cloud database
export async function saveUserToCloud(user: CustomerUser): Promise<void> {
  const path = `${USERS_COLLECTION}/${user.id}`;
  try {
    const userRef = doc(db, USERS_COLLECTION, user.id);
    await setDoc(userRef, {
      ...user,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
