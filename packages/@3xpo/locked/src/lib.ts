import ResolvablePromise from '@3xpo/resolvablepromise';

export type LockResolutionFunction<ReturnType = undefined> =
  ReturnType extends undefined
    ? (v?: undefined) => undefined
    : (v: ReturnType) => ReturnType;
export type LockPromise = Promise<void>;

export class LockException extends Error {}
export class SanityException extends LockException {}
export class BubblingException extends LockException {
  public constructor(
    public message: string,
    public parent: any,
  ) {
    super(message);
  }
}

export class Locked {
  protected activeLocks: Record<symbol | string, LockPromise[]> = {};

  public throwOnLockFuncErr = false;

  public lockFunc<
    Rt extends any,
    Arg extends any[],
    Fun extends (...args: Arg) => Rt | Promise<Rt>,
  >(func: Fun, key: string): (...args: Arg) => Promise<Rt> {
    return async (...args: Arg) => {
      const unlock = await this.lock(key);
      try {
        const rt = await func(...args);
        unlock();
        return rt;
      } catch (error) {
        if (this.throwOnLockFuncErr)
          throw new BubblingException(
            `Threw error in lockFunc callback, not unlocking. Key: ${JSON.stringify(
              key,
            )}`,
            error,
          );
        unlock();
        console.warn(
          'Unlocked in faulty state; set locked.throwOnLockFuncErr to true to prevent this behaviour, resulting in an infinite lock. Lock Key:',
          key,
        );
        throw error;
      }
    };
  }

  public lock<ReturnType = undefined>(
    key: symbol | string,
  ): Promise<LockResolutionFunction<ReturnType>> {
    if (!this.activeLocks[key]) this.activeLocks[key] = [];

    let returnValue: (value: LockResolutionFunction<ReturnType>) => void;
    let throwValue: (err: any) => void;
    const previousLocksPromise = new Promise<
      LockResolutionFunction<ReturnType>
    >((res, rej) => {
      returnValue = res;
      throwValue = rej;
    });
    let resolveLock: (v: void) => void;
    let throwLock: () => void;
    const thisLockPromise = new ResolvablePromise<void>(
      (res, rej) => ((resolveLock = res), (throwLock = rej)),
    );

    const previousLocksAll = Promise.all(this.activeLocks[key]);

    const rawResolveFunction = (rt: ReturnType) => {
      resolveLock(void 0);
      this.unlock(key, thisLockPromise, false);
      return rt;
    };
    // Resolves the function, awaiting the promise if one is provided prior to resolving
    const resolveFunction = (rt: ReturnType) => {
      if (rt instanceof Promise)
        return (async () => {
          const rtResult = await rt;
          return rawResolveFunction(rtResult);
        })();
      else return rawResolveFunction(rt);
    };

    previousLocksAll
      .then(() => returnValue(resolveFunction as any))
      .catch(err =>
        throwValue(
          new BubblingException('Bubbled Error while waiting for lock', err),
        ),
      );

    this.activeLocks[key].push(thisLockPromise);

    return previousLocksPromise;
  }

  protected unlock(
    key: symbol | string,
    lockPromise: Promise<void>,
    throwIfCannotResolve = true,
  ): void {
    if (lockPromise instanceof ResolvablePromise) lockPromise.resolve(void 0);
    else if (throwIfCannotResolve)
      throw new LockException(
        'Cannot resolve promise; not a ResolvablePromise',
      );
    this.activeLocks[key] = this.activeLocks[key].filter(
      promise => promise !== lockPromise,
    );
    if (this.activeLocks[key].length === 0) delete this.activeLocks[key];
  }
  protected unlockWithError(
    key: symbol | string,
    lockPromise: Promise<void>,
    rejectionCause: any = 'Unspecified Rejection Cause',
    throwIfCannotReject = true,
  ): void {
    if (lockPromise instanceof ResolvablePromise)
      lockPromise.reject(rejectionCause);
    else if (throwIfCannotReject)
      throw new LockException(
        'Cannot resolve promise; not a ResolvablePromise',
      );
    if (lockPromise instanceof ResolvablePromise)
      this.activeLocks[key] = this.activeLocks[key].filter(
        promise => promise !== lockPromise,
      );
    if (this.activeLocks[key].length === 0) delete this.activeLocks[key];
  }
}

export default Locked;
