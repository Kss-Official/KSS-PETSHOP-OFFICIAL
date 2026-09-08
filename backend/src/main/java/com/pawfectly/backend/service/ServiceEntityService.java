package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.ServiceDto;
import com.pawfectly.backend.entity.ServiceEntity;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ServiceEntityService {

    private final ServiceRepository serviceRepository;

    @Transactional(readOnly = true)
    public List<ServiceDto> getActiveServices() {
        return serviceRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ServiceDto> getAllServicesAdmin() {
        return serviceRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServiceDto getServiceById(Long id) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        if (!Boolean.TRUE.equals(service.getIsActive())) {
            throw new ResourceNotFoundException("Service not found with id: " + id);
        }
        return mapToDto(service);
    }

    @Transactional
    public ServiceDto createService(ServiceDto dto) {
        ServiceEntity service = ServiceEntity.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .iconUrl(dto.getIconUrl())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        ServiceEntity saved = serviceRepository.save(service);
        log.info("Created service: {}", saved.getName());
        return mapToDto(saved);
    }

    @Transactional
    public ServiceDto updateService(Long id, ServiceDto dto) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));

        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        if (dto.getIconUrl() != null) service.setIconUrl(dto.getIconUrl());
        if (dto.getIsActive() != null) service.setIsActive(dto.getIsActive());

        ServiceEntity updated = serviceRepository.save(service);
        log.info("Updated service id: {}", id);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteService(Long id) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        service.setIsActive(false);
        serviceRepository.save(service);
        log.info("Soft-deleted service id: {}", id);
    }

    private ServiceDto mapToDto(ServiceEntity service) {
        return ServiceDto.builder()
                .id(service.getId())
                .name(service.getName())
                .description(service.getDescription())
                .iconUrl(service.getIconUrl())
                .isActive(service.getIsActive())
                .build();
    }
}
