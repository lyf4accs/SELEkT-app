import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PhotoFacadeService } from './photoFacade.service';
import { SupabaseService } from './supabase.service';
import { DropsendService } from './dropsend.service';
import { ClipboardService } from './clip-board.service';
import { PhotoLibraryService } from './PhotoLibraryService';
import { DuplicatePhotoService } from './duplicate-photo.service';
import { SimilarPhotoService } from './similar-photo.service';
import { HashService } from './hash.service';
import { NameGeneratorService } from './name-generator.service';
import { GalleryService } from './GalleryService';
import { Moodboard } from '../models/Moodboard';

describe('PhotoFacadeService', () => {
  let service: PhotoFacadeService;

  // mocks
  let supabaseServiceSpy: jasmine.SpyObj<SupabaseService>;
  let dropSendServiceSpy: jasmine.SpyObj<DropsendService>;
  let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;
  let photoLibraryServiceSpy: jasmine.SpyObj<PhotoLibraryService>;
  let duplicatePhotoServiceSpy: jasmine.SpyObj<DuplicatePhotoService>;
  let similarPhotoServiceSpy: jasmine.SpyObj<SimilarPhotoService>;
  let hashServiceSpy: jasmine.SpyObj<HashService>;
  let nameGeneratorServiceSpy: jasmine.SpyObj<NameGeneratorService>;
  let galleryServiceSpy: jasmine.SpyObj<GalleryService>;

  beforeEach(() => {
    supabaseServiceSpy = jasmine.createSpyObj('SupabaseService', [
      'getPhotosByAlbumId',
      'getUserAlbums',
      'uploadAlbum',
      'deleteAlbum',
      'getAlbumByCode',
      'clearAnalysisBucket',
      'uploadImageForAnalysis',
      'updatePassword',
      'uploadToColorBucket',
    ]);

    dropSendServiceSpy = jasmine.createSpyObj('DropsendService', [
      'disconnect',
      'sendFile',
      'getMyPeerId',
      'getPeers',
      'getPeerJoined',
      'getPeerLeft',
      'getSignal',
      'getDisplayName',
      'getNotifications',
    ]);

    clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', [
      'writeText',
    ]);
    photoLibraryServiceSpy = jasmine.createSpyObj('PhotoLibraryService', [
      'processImages',
      'hashImage',
      'compareHashes',
      'getDominantColors',
      'groupByPalette',
    ]);
    duplicatePhotoServiceSpy = jasmine.createSpyObj(
      'DuplicatePhotoService',
      ['updateDuplicatePhotos', 'getDuplicatePhotos', 'getDuplicateAlbums'],
      { duplicatePhotos$: of([]) }
    );
    similarPhotoServiceSpy = jasmine.createSpyObj(
      'SimilarPhotoService',
      ['updateSimilarPhotos', 'getSimilarPhotos', 'getSimilarAlbums'],
      { similarPhotos$: of([]) }
    );
    hashServiceSpy = jasmine.createSpyObj('HashService', [
      'setHashes',
      'getHashes',
      'clearHashes',
    ]);
    nameGeneratorServiceSpy = jasmine.createSpyObj('NameGeneratorService', [
      'generateName',
    ]);
    galleryServiceSpy = jasmine.createSpyObj('GalleryService', [
      'requestGalleryPermission',
      'saveGalleryPermission',
      'hasGalleryPermission',
    ]);

    TestBed.configureTestingModule({
      providers: [
        PhotoFacadeService,
        { provide: SupabaseService, useValue: supabaseServiceSpy },
        { provide: DropsendService, useValue: dropSendServiceSpy },
        { provide: ClipboardService, useValue: clipboardServiceSpy },
        { provide: PhotoLibraryService, useValue: photoLibraryServiceSpy },
        { provide: DuplicatePhotoService, useValue: duplicatePhotoServiceSpy },
        { provide: SimilarPhotoService, useValue: similarPhotoServiceSpy },
        { provide: HashService, useValue: hashServiceSpy },
        { provide: NameGeneratorService, useValue: nameGeneratorServiceSpy },
        { provide: GalleryService, useValue: galleryServiceSpy },
      ],
    });

    service = TestBed.inject(PhotoFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update and emit the display name', (done) => {
    const displayName = 'FotoMaster3000';

    service.updateDisplayName(displayName); // actualizamos el valor

    service.displayName$.subscribe((value) => {
      expect(value).toBe(displayName); // comprobamos que el observable lo emite
      done(); // terminamos el test (porque es asíncrono)
    });
  });

  it('should store and retrieve the album ID correctly', () => {
    const albumId = 'album-1234';
    service.setWhichAlbum(albumId); // guardamos el ID

    const result = service.getWhichAlbum(); // lo recuperamos

    expect(result).toBe(albumId); // comprobamos que es el mismo
  });

  it('should call hashService.setHashes with the correct data', () => {
    const hashData = [
      { hash: 'abc123', url: 'url1', fileName: 'foto1.jpg' },
      { hash: 'def456', url: 'url2', fileName: 'foto2.jpg' },
    ];

    service.setHashes(hashData); // delega en el servicio

    expect(hashServiceSpy.setHashes).toHaveBeenCalledWith(hashData); // verifica que se llamó correctamente
  });

  it('should return hashes from hashService.getHashes', () => {
    const mockHashes = [
      { hash: 'aaa', url: 'url1', fileName: '1.jpg' },
      { hash: 'bbb', url: 'url2', fileName: '2.jpg' },
    ];

    hashServiceSpy.getHashes.and.returnValue(mockHashes);

    const result = service.getHashes();

    expect(result).toEqual(mockHashes);
  });

  it('should call hashService.clearHashes', () => {
    service.clearHashes();

    expect(hashServiceSpy.clearHashes).toHaveBeenCalled(); // Verificamos que se haya llamado
  });

  it('should call supabaseService.uploadImageForAnalysis and return result', async () => {
    const base64 = 'data:image/jpeg;base64,...';
    const index = 2;
    const expectedResult = {
      fileName: 'foto.jpg',
      url: 'http://fake.url/foto.jpg',
    };

    supabaseServiceSpy.uploadImageForAnalysis.and.returnValue(
      Promise.resolve(expectedResult)
    );

    const result = await service.uploadImageForAnalysis(base64, index);

    expect(result).toEqual(expectedResult);
    expect(supabaseServiceSpy.uploadImageForAnalysis).toHaveBeenCalledWith(
      base64,
      index
    );
  });

  it('should call photoLibraryService.compareHashes with the correct hashes', () => {
    const hashes = [
      { hash: 'hash1', url: 'url1' },
      { hash: 'hash2', url: 'url2' },
    ];

    service.compareHashes(hashes);

    expect(photoLibraryServiceSpy.compareHashes).toHaveBeenCalledWith(hashes);
  });

  it('should return photos from supabaseService.getPhotosByAlbumId', async () => {
    const albumId = 123;
    const mockPhotos = [{ id: 1 }, { id: 2 }];
    supabaseServiceSpy.getPhotosByAlbumId.and.returnValue(
      Promise.resolve(mockPhotos)
    );

    const result = await service.getPhotosByAlbumId(albumId);

    expect(result).toEqual(mockPhotos);
    expect(supabaseServiceSpy.getPhotosByAlbumId).toHaveBeenCalledWith(albumId);
  });

  it('should return albums from supabaseService.getUserAlbums', async () => {
    const userId = 'user123';
    const mockAlbums = [{ id: 1, name: 'Álbum 1' }];
    supabaseServiceSpy.getUserAlbums.and.returnValue(
      Promise.resolve(mockAlbums)
    );

    const result = await service.getUserAlbums(userId);

    expect(result).toEqual(mockAlbums);
    expect(supabaseServiceSpy.getUserAlbums).toHaveBeenCalledWith(userId);
  });

  it('should call supabaseService.uploadAlbum with the given files', async () => {
    const mockFiles = [new File(['contenido'], 'foto.jpg')];
    const mockResponse = 'album123';

    supabaseServiceSpy.uploadAlbum.and.returnValue(
      Promise.resolve(mockResponse)
    );

    const result = await service.uploadAndProcessPhotos(mockFiles);

    expect(result).toBe(mockResponse);
    expect(supabaseServiceSpy.uploadAlbum).toHaveBeenCalledWith(mockFiles);
  });

  it('should delete an album using supabaseService and return result', async () => {
    const albumId = 1;
    const albumCode = 'ABC123';
    supabaseServiceSpy.deleteAlbum.and.returnValue(Promise.resolve(true));

    const result = await service.deleteAlbum(albumId, albumCode);

    expect(result).toBeTrue();
    expect(supabaseServiceSpy.deleteAlbum).toHaveBeenCalledWith(
      albumId,
      albumCode
    );
  });

  it('should call supabaseService.updatePassword with the correct credentials', async () => {
    const currentPassword = 'old123';
    const newPassword = 'new456';
    const expectedResult = { error: null };

    supabaseServiceSpy.updatePassword.and.returnValue(
      Promise.resolve(expectedResult)
    );

    const result = await service.updatePassword(currentPassword, newPassword);

    expect(result).toBe(expectedResult);
    expect(supabaseServiceSpy.updatePassword).toHaveBeenCalledWith(
      currentPassword,
      newPassword
    );
  });

  it('should call duplicatePhotoService.updateDuplicatePhotos with correct arguments', () => {
    const photos = [{ id: '1' }];
    const albums = [{ id: 'a' }];

    service.updateDuplicatePhotos(photos, albums);

    expect(duplicatePhotoServiceSpy.updateDuplicatePhotos).toHaveBeenCalledWith(
      photos,
      albums
    );
  });

  it('should return duplicate photos from duplicatePhotoService', () => {
    const mockDuplicates = [{ id: 'd1' }, { id: 'd2' }];
    duplicatePhotoServiceSpy.getDuplicatePhotos.and.returnValue(mockDuplicates);

    const result = service.getDuplicatePhotos();

    expect(result).toEqual(mockDuplicates);
  });

  it('should call similarPhotoService.updateSimilarPhotos with correct arguments', () => {
    const photos = [{ id: '10' }];
    const albums = [{ id: 'b' }];

    service.updateSimilarPhotos(photos, albums);

    expect(similarPhotoServiceSpy.updateSimilarPhotos).toHaveBeenCalledWith(
      photos,
      albums
    );
  });

  it('should return similar photos from similarPhotoService', () => {
    const mockSimilar = [{ id: 's1' }, { id: 's2' }];
    similarPhotoServiceSpy.getSimilarPhotos.and.returnValue(mockSimilar);

    const result = service.getSimilarPhotos();

    expect(result).toEqual(mockSimilar);
  });

  it('should return duplicate albums from duplicatePhotoService when type is "duplicate"', () => {
    const mockAlbums = [{ id: 'dup1' }];
    duplicatePhotoServiceSpy.getDuplicateAlbums.and.returnValue(mockAlbums);

    const result = service.getAlbums('duplicate');

    expect(result).toEqual(mockAlbums);
  });

  it('should return similar albums from similarPhotoService when type is "similar"', () => {
    const mockAlbums = [{ id: 'sim1' }];
    similarPhotoServiceSpy.getSimilarAlbums.and.returnValue(mockAlbums);

    const result = service.getAlbums('similar');

    expect(result).toEqual(mockAlbums);
  });

  // 🎨 setColorMoodboards
  it('should store colorMoodboards in localStorage', () => {
    const moodboards: Moodboard[] = [
      {
        name: 'Summer Vibes',
        colorKey: '2-3-1',
        photos: ['url1.jpg'],
        coverPhoto: 'cover.jpg',
        dominantColor: 'rgb(255, 200, 100)',
      },
    ];
    const setItemSpy = spyOn(localStorage, 'setItem');

    service.setColorMoodboards(moodboards);

    expect(setItemSpy).toHaveBeenCalledWith(
      'colorMoodboards',
      JSON.stringify(moodboards)
    );
  });

  // 🎨 getColorMoodboards desde localStorage
  it('should retrieve colorMoodboards from localStorage if available', () => {
    const stored = JSON.stringify([{ id: '2', name: 'Winter' }]);
    spyOn(localStorage, 'getItem').and.returnValue(stored);

    const result = service.getColorMoodboards();

    expect(result).toEqual(JSON.parse(stored));
  });

  // 🎨 uploadToColorBucket
  it('should call supabaseService.uploadToColorBucket with correct arguments', async () => {
    const base64 = 'data:image/png;base64,...';
    const index = 1;
    const mockUrl = 'https://fake.storage/color/image.png';

    supabaseServiceSpy.uploadToColorBucket.and.returnValue(
      Promise.resolve(mockUrl)
    );

    const result = await service.uploadToColorBucket(base64, index);

    expect(result).toBe(mockUrl);
    expect(supabaseServiceSpy.uploadToColorBucket).toHaveBeenCalledWith(
      base64,
      index
    );
  });

  // 🎨 getDominantColors
  it('should call photoLibraryService.getDominantColors with given URLs', () => {
    const urls = ['url1', 'url2'];

    service.getDominantColors(urls);

    expect(photoLibraryServiceSpy.getDominantColors).toHaveBeenCalledWith(urls);
  });

  // 🎨 groupByPalette
  it('should call photoLibraryService.groupByPalette with correct data', () => {
    const colors = [
      { url: 'image1.jpg', color: '#ff0000' },
      { url: 'image2.jpg', color: '#00ff00' },
    ];

    service.groupByPalette(colors);

    expect(photoLibraryServiceSpy.groupByPalette).toHaveBeenCalledWith(colors);
  });

  it('should call dropSendService.sendFile with correct arguments', () => {
    const buffer = new ArrayBuffer(8);
    const fileName = 'document.pdf';
    const peer = { id: 'peer123' };

    service.sendFile(buffer, fileName, peer);

    expect(dropSendServiceSpy.sendFile).toHaveBeenCalledWith(
      buffer,
      fileName,
      peer
    );
  });

  it('should call dropSendService.disconnect', () => {
    service.disconnectDropsend();

    expect(dropSendServiceSpy.disconnect).toHaveBeenCalled();
  });

  it('should return getPeers$ observable from dropSendService', () => {
    const mock$ = of([{ id: 'peer1' }]);
    dropSendServiceSpy.getPeers.and.returnValue(mock$);

    const result = service.getPeers();

    result.subscribe((value) => {
      expect(value).toEqual([{ id: 'peer1' }]);
    });
  });

  it('should return getPeerJoined$ observable from dropSendService', () => {
    const mock$ = of({ id: 'peer2' });
    dropSendServiceSpy.getPeerJoined.and.returnValue(mock$);

    const result = service.getPeerJoined();

    result.subscribe((value) => {
      expect(value).toEqual({ id: 'peer2' });
    });
  });

  it('should return getPeerLeft$ observable from dropSendService', () => {
    const mock$ = of('peer3');
    dropSendServiceSpy.getPeerLeft.and.returnValue(mock$);

    const result = service.getPeerLeft();

    result.subscribe((value) => {
      expect(value).toBe('peer3');
    });
  });

  it('should return signal observable from dropSendService', () => {
    const mock$ = of({ signal: 'data' });
    dropSendServiceSpy.getSignal.and.returnValue(mock$);

    const result = service.getSignal();

    result.subscribe((value) => {
      expect(value).toEqual({ signal: 'data' });
    });
  });

  it('should return display name signal from dropSendService', () => {
    const mock$ = of('DeviceName');
    dropSendServiceSpy.getDisplayName.and.returnValue(mock$);

    const result = service.getDisplayNameSignal();

    result.subscribe((value) => {
      expect(value).toBe('DeviceName');
    });
  });

  it('should return notifications observable from dropSendService', () => {
    const mock$ = of('¡Nuevo archivo recibido!');
    dropSendServiceSpy.getNotifications.and.returnValue(mock$);

    const result = service.getNotifications();

    result.subscribe((value) => {
      expect(value).toBe('¡Nuevo archivo recibido!');
    });
  });

  it('should return peerId observable from dropSendService', () => {
    const mock$ = of('peerId-xyz');
    dropSendServiceSpy.getMyPeerId.and.returnValue(mock$);

    const result = service.getMyPeerId();

    result.subscribe((value) => {
      expect(value).toBe('peerId-xyz');
    });
  });

  it('should call clipboardService.writeText with the album link', async () => {
    const link = 'https://app.com/album/123';

    clipboardServiceSpy.writeText.and.returnValue(Promise.resolve());

    await service.copyAlbumLink(link);

    expect(clipboardServiceSpy.writeText).toHaveBeenCalledWith(link);
  });

  it('should return result from galleryService.requestGalleryPermission', () => {
    galleryServiceSpy.requestGalleryPermission.and.returnValue(true);

    const result = service.checkGalleryAccess();

    expect(result).toBeTrue();
  });

  it('should call galleryService.saveGalleryPermission with the correct value', () => {
    service.setGalleryAccess(true);

    expect(galleryServiceSpy.saveGalleryPermission).toHaveBeenCalledWith(true);
  });

  it('should return gallery permission from galleryService.hasGalleryPermission', () => {
    galleryServiceSpy.hasGalleryPermission.and.returnValue(false);

    const result = service.getGalleryAccess();

    expect(result).toBeFalse();
  });

  // 🔹 getAlbumByCode
  it('should return album ID from supabaseService.getAlbumByCode', async () => {
    const albumCode = 'abc123';
    const expectedId = 42;

    supabaseServiceSpy.getAlbumByCode.and.returnValue(
      Promise.resolve(expectedId)
    );

    const result = await service.getAlbumByCode(albumCode);

    expect(result).toBe(expectedId);
    expect(supabaseServiceSpy.getAlbumByCode).toHaveBeenCalledWith(albumCode);
  });

  // 🔹 processImages
  it('should call photoLibraryService.processImages with the provided images', () => {
    const images = ['img1.jpg', 'img2.jpg'];

    service.processImages(images);

    expect(photoLibraryServiceSpy.processImages).toHaveBeenCalledWith(images);
  });

  // 🔹 hashImage
  it('should call photoLibraryService.hashImage with the correct URL', () => {
    const url = 'https://example.com/photo.jpg';

    service.hashImage(url);

    expect(photoLibraryServiceSpy.hashImage).toHaveBeenCalledWith(url);
  });

  // 🔹 generateName
  it('should call nameGeneratorService.generateName with seed and return result', () => {
    const seed = 'abc123';
    const expectedName = { displayName: 'CoolCat', deviceName: 'Device42' };

    nameGeneratorServiceSpy.generateName.and.returnValue(expectedName);

    const result = service.generateName(seed);

    expect(result).toEqual(expectedName);
    expect(nameGeneratorServiceSpy.generateName).toHaveBeenCalledWith(seed);
  });

  it('should set and get the current album index', () => {
    service.setCurrentAlbumIndex(3);

    const result = service.getCurrentAlbumIndex();

    expect(result).toBe(3);
  });

  it('should remove album and update duplicates if albumType is "duplicate"', () => {
    const mockAlbums = [{ id: '1' }, { id: '2' }];
    (service as any).duplicateAlbums = [...mockAlbums];

    service.removeAlbumByIndex('duplicate', 0);

    expect((service as any).duplicateAlbums.length).toBe(1);
    expect(duplicatePhotoServiceSpy.updateDuplicatePhotos).toHaveBeenCalledWith(
      [],
      [{ id: '2' }]
    );
  });

  it('should remove album and update similars if albumType is "similar"', () => {
    const mockAlbums = [{ id: 'a' }, { id: 'b' }];
    (service as any).similarAlbums = [...mockAlbums];

    service.removeAlbumByIndex('similar', 1);

    expect((service as any).similarAlbums.length).toBe(1);
    expect(similarPhotoServiceSpy.updateSimilarPhotos).toHaveBeenCalledWith(
      [],
      [{ id: 'a' }]
    );
  });

  it('should call supabaseService.clearAnalysisBucket', async () => {
    supabaseServiceSpy.clearAnalysisBucket.and.returnValue(Promise.resolve());

    await service.clearAnalysisBucket();

    expect(supabaseServiceSpy.clearAnalysisBucket).toHaveBeenCalled();
  });


});

