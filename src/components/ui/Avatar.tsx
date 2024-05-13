'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';

// ----------------------------------------------------------------------------
// AVATAR COMPONENT
// ----------------------------------------------------------------------------
const Avatar = forwardRef<
  ElementRef<typeof AvatarPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, forwardedRef) => {
  return (
    <AvatarPrimitive.Root
      ref={forwardedRef}
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
});

Avatar.displayName = AvatarPrimitive.Root.displayName;

// ----------------------------------------------------------------------------
// AVATAR IMAGE
// ----------------------------------------------------------------------------
const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, forwardedRef) => {
  return (
    <AvatarPrimitive.Image
      ref={forwardedRef}
      className={cn('aspect-square h-full w-full object-contain', className)}
      {...props}
    />
  );
});

AvatarImage.displayName = AvatarPrimitive.Image.displayName;

// ----------------------------------------------------------------------------
// AVATAR FALLBACK
// ----------------------------------------------------------------------------
const AvatarFallback = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, forwardedRef) => {
  return (
    <AvatarPrimitive.Fallback
      ref={forwardedRef}
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
      {...props}
    />
  );
});

AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// ----------------------------------------------------------------------------
// EXPORTS
// ----------------------------------------------------------------------------
export { Avatar, AvatarImage, AvatarFallback };
