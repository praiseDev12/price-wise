'use client';

import { addUserEmailToProduct } from '@/lib/actions';
import { Button, Dialog, Transition, TransitionChild } from '@headlessui/react';
import Image from 'next/image';
import { FormEvent, Fragment, useState } from 'react';

interface Props {
	productId: string;
}

const Modal = ({ productId }: Props) => {
	let [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [email, setEmail] = useState('');

	function open() {
		setIsOpen(true);
	}

	function close() {
		setIsOpen(false);
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		await addUserEmailToProduct(productId, email);

		setIsSubmitting(false);
		setEmail('');
		close();
	};

	return (
		<>
			<Button type='button' onClick={open} className='btn'>
				Track
			</Button>

			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as='div' className='dialog-container' onClose={close}>
					<div className='min-h-screen px-4 text-center'>
						<TransitionChild
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'>
							<div
								className='fixed -z-1 inset-0 bg-black/25 cursor-pointer'
								onClick={close}
							/>
						</TransitionChild>

						<span
							className='inline-block h-screen align-middle'
							aria-hidden='true'
						/>

						<TransitionChild
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<div className='dialog-content z-10'>
								<div className='flex flex-col'>
									<div className='flex justify-between'>
										<div className='p-3 border border-gray-200'>
											<Image
												src='/assets/icons/logo.svg'
												alt='logo'
												width={28}
												height={28}
											/>
										</div>

										<Image
											src='/assets/icons/x-close.svg'
											alt='close'
											width={24}
											height={24}
											className='cursor-pointer'
											onClick={close}
										/>
									</div>

									<h4 className='dialog-head_text'>
										Stay Update with product pricing alerts right in your inbox!
									</h4>

									<p className='text-sm text-gray-600 mt-2'>
										Never miss a bargain again with our timely alerts!
									</p>
								</div>

								<form onSubmit={handleSubmit} className='flex flex-col mt-5'>
									<label
										htmlFor='email'
										className='text-sm font-medium text-gray-700'>
										Email address
									</label>
									<div className='dialog-input_container'>
										<Image
											src='/assets/icons/mail.svg'
											alt='mail'
											width={18}
											height={18}
										/>

										<input
											required
											type='email'
											id='email'
											onChange={(e) => setEmail(e.target.value)}
											value={email}
											placeholder='Enter your email address'
											className='dialog-input'
										/>
									</div>
									<button type='submit' className='dialog-btn'>
										{isSubmitting ? 'Submitting...' : 'Track'}
									</button>
								</form>
							</div>
						</TransitionChild>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default Modal;
